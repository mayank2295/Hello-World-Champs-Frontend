import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { MdOutlineSchool, MdSearch } from 'react-icons/md';
import './CoursesPage.css';

const API_BASE_URL = 'https://courses-backend-production-e28c.up.railway.app';

// --- Sub-components ---
const CourseCardSkeleton = () => (
    <div className="course-item-card is-loading">
        <div className="skeleton skeleton-image"></div>
        <div className="course-item-details">
            <div className="skeleton skeleton-provider"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-desc"></div>
            <div className="skeleton skeleton-button"></div>
        </div>
    </div>
);

const CourseCard = ({ course }) => (
    <div className="course-item-card">
        <div className="course-item-image-wrapper">
            <img src={course.image_240x135 || '/courses/placeholder.jpg'} alt={course.title} className="course-item-image" />
        </div>
        <div className="course-item-details">
            <div>
                {/* The API provides instructors inside an array, we'll show the first one */}
                <span className="course-item-provider">{course.visible_instructors?.[0]?.title || 'Udemy'}</span>
                <h3 className="course-item-title">{course.title}</h3>
            </div>
            <a href={`https://www.udemy.com${course.url}`} target="_blank" rel="noopener noreferrer" className="course-item-apply-btn">
                View Course
            </a>
        </div>
    </div>
);

// --- Main Page Component ---
export default function CoursesPage({ currentUser }) {
    const [courses, setCourses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userName, setUserName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!currentUser) {
            setIsLoading(false);
            return;
        }

        const fetchRecommendedCourses = async () => {
            try {
                setIsLoading(true);
                let interests = [];
                // Get user's name and quiz interests
                try {
                    const userDocRef = doc(db, 'users', currentUser.uid);
                    // THIS LINE IS NOW CORRECTED
                    const userDoc = await getDoc(userDocRef); 
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData?.name || currentUser.displayName || '');
                        interests = userData?.quizResults?.interests || [];
                    } else {
                         // Set username even if there's no doc yet
                        setUserName(currentUser.displayName || '');
                    }
                } catch (firestoreError) {
                    console.error("Firestore permission error. Will show default courses.", firestoreError.message);
                     // Set username from auth as a fallback
                    setUserName(currentUser.displayName || '');
                }

                const interestsQuery = interests.join(',');
                const apiUrl = `${API_BASE_URL}/api/courses?interests=${interestsQuery}`;
                
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                
                const data = await response.json();
                setCourses(Array.isArray(data) ? data : []);

            } catch (err) {
                console.error("Error fetching course data:", err);
                setError("Could not load course data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchRecommendedCourses();
    }, [currentUser]);

    const filteredCourses = courses.filter(course => {
        const query = searchQuery.toLowerCase();
        return (course.title || '').toLowerCase().includes(query);
    });

    const renderContent = () => {
        if (isLoading) {
            return Array.from({ length: 6 }).map((_, index) => <CourseCardSkeleton key={index} />);
        }
        if (error) {
            return <div className="courses-error-state">{error}</div>;
        }
        if (filteredCourses.length === 0) {
            return ( <div className="courses-empty-state"><MdOutlineSchool className="courses-empty-icon" /><h3 className="courses-empty-title">No Courses Found</h3><p className="courses-empty-desc">Try adjusting your search or check back later for new courses.</p></div> );
        }
        return filteredCourses.map(course => <CourseCard key={course.id} course={course} />);
    };

    return (
        <div className="courses-container">
            <div className="courses-card">
                <div className="courses-header">
                    <div>
                        <h1 className="courses-title">Explore Courses</h1>
                        <p className="courses-subtitle">Find the next step in your professional journey, {userName}.</p>
                    </div>
                </div>
                <div className="courses-controls">
                    <div className="courses-search-bar" style={{width: '100%'}}>
                        <MdSearch className="courses-search-icon" />
                        <input
                            type="text"
                            placeholder="Search recommended courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
                <div className="courses-grid">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}