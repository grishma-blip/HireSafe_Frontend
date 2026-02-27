// ===== BACKGROUND IMAGE SCROLL EFFECT =====
document.addEventListener('DOMContentLoaded', function() {
    const backgroundImage = document.querySelector('.background-image');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            backgroundImage.classList.add('scrolled');
        } else {
            backgroundImage.classList.remove('scrolled');
        }
    });
});

// ===== NAVIGATION FUNCTIONALITY =====
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active section highlighting
    const sections = document.querySelectorAll('section');
    
    function highlightActiveSection() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);
    highlightActiveSection();
});

// ===== INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', function() {
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// ===== FRAUD DETECTION FORM =====
document.addEventListener('DOMContentLoaded', function() {
    const fraudForm = document.getElementById('fraudForm');
    const resultBox = document.getElementById('resultBox');
    const fraudProbability = document.getElementById('fraudProbability');
    const riskLevel = document.getElementById('riskLevel');

    fraudForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const jobTitle = document.getElementById('jobTitle').value.trim();
        const companyProfile = document.getElementById('companyProfile').value.trim();
        const jobDescription = document.getElementById('jobDescription').value.trim();
        const salaryRange = document.getElementById('salaryRange').value.trim();
        const telecommuting = document.getElementById('telecommuting').value;
        const experience = document.getElementById('experience').value;
        const employmentType = document.getElementById('employmentType').value;
        const hasCompanyLogo = document.getElementById('hasCompanyLogo').value;
        const requiredSkills = document.getElementById('requiredSkills').value.trim();
        const benefits = document.getElementById('benefits').value.trim();
        
        // Show loading state
        resultBox.classList.remove('hidden');
        document.getElementById('fraudProbability').textContent = 'Analyzing...';
        document.getElementById('riskLevel').textContent = 'Processing...';
        document.getElementById('confidenceText').textContent = '0%';
        document.getElementById('recommendationText').textContent = 'Analyzing job posting for fraud indicators...';
        
        // Clear previous risk factors
        const riskFactorsList = document.getElementById('riskFactorsList');
        riskFactorsList.innerHTML = '';
        
        // Prepare data for API
        const jobData = {
            title: jobTitle,
            company_profile: companyProfile,
            description: jobDescription,
            salary_range: salaryRange,
            telecommuting: telecommuting,
            experience_required: experience,
            employment_type: employmentType,
            has_company_logo: hasCompanyLogo,
            required_skills: requiredSkills,
            benefits: benefits
        };
        
        // Call backend API
        fetch('https://hiresafe-backend-fxxk.onrender.com/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(jobData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Update UI with backend results
            updateResultsWithBackendData(data);
        })
        .catch(error => {
            console.error('Error:', error);
            // Fallback to mock data if backend fails
            console.log('Backend unavailable, using mock data');
            updateResultsWithMockData(jobData);
        });
    });
    
    function updateResultsWithBackendData(data) {
        // Animate probability counter
        let currentProb = 0;
        const targetProb = data.fraud_probability || 85;
        const increment = targetProb / 50;
        const timer = setInterval(() => {
            currentProb += increment;
            if (currentProb >= targetProb) {
                currentProb = targetProb;
                clearInterval(timer);
            }
            document.getElementById('fraudProbability').textContent = Math.round(currentProb) + '%';
        }, 20);
        
        // Update risk level
        const riskLevelText = data.risk_level || 'High';
        const riskClass = data.risk_level === 'High' ? 'risk-high' : 
                         data.risk_level === 'Medium' ? 'risk-medium' : 'risk-low';
        
        document.getElementById('riskLevel').textContent = riskLevelText;
        document.getElementById('riskLevel').className = 'result-value ' + riskClass;
        
        // Update confidence
        const confidence = data.confidence || 85;
        setTimeout(() => {
            document.getElementById('confidenceFill').style.width = confidence + '%';
            document.getElementById('confidenceText').textContent = confidence + '%';
        }, 100);
        
        // Update risk factors
        const riskFactorsList = document.getElementById('riskFactorsList');
        riskFactorsList.innerHTML = '';
        
        if (data.risk_factors && data.risk_factors.length > 0) {
            data.risk_factors.forEach(factor => {
                const li = document.createElement('li');
                li.textContent = factor;
                riskFactorsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'No significant risk factors detected';
            li.style.color = '#4CAF50';
            riskFactorsList.appendChild(li);
        }
        
        // Update recommendation
        document.getElementById('recommendationText').textContent = 
            data.recommendation || 'WARNING: This posting shows strong indicators of fraud. Do not proceed with this opportunity.';
        
        // Scroll to results
        setTimeout(() => {
            resultBox.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest' 
            });
        }, 100);
        
        // Log results for debugging
        console.log('Backend Results:', data);
    }
    
    function updateResultsWithMockData(jobData) {
        // Fallback mock data
        const mockData = {
            fraud_probability: 85,
            risk_level: 'High',
            confidence: 85,
            risk_factors: [
                'Demo mode: Backend unavailable, using mock data',
                'Short job description detected',
                'Missing salary information',
                'Generic job title detected'
            ],
            recommendation: 'WARNING: This posting shows strong indicators of fraud. Do not proceed with this opportunity.'
        };
        
        updateResultsWithBackendData(mockData);
    }
});

// ===== SMOOTH SCROLL FOR NAVIGATION LINKS =====
document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a[href^="#"]:not([target="_blank"])');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===== PARTICLE ANIMATION ENHANCEMENT =====
document.addEventListener('DOMContentLoaded', function() {
    const particles = document.querySelectorAll('.particle');
    
    particles.forEach((particle, index) => {
        // Randomize initial positions
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        particle.style.left = randomX + '%';
        particle.style.top = randomY + '%';
        
        // Randomize animation duration
        const randomDuration = 15 + Math.random() * 10;
        particle.style.animationDuration = randomDuration + 's';
        
        // Randomize size
        const randomSize = 1 + Math.random() * 3;
        particle.style.width = randomSize + 'px';
        particle.style.height = randomSize + 'px';
    });
});

// ===== NAVBAR SCROLL EFFECT =====
document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Keep navbar always visible, just add background effects
        if (scrollTop > 50) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.8)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        }
        
        lastScrollTop = scrollTop;
    });
});

// ===== FORM INPUT ENHANCEMENTS =====
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add focus effect
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 30px rgba(255, 255, 255, 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // Add character counter for textareas
        if (input.tagName === 'TEXTAREA') {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = `
                font-size: 0.8rem;
                opacity: 0.6;
                text-align: right;
                margin-top: 0.25rem;
                transition: all 0.3s ease;
            `;
            
            input.parentElement.appendChild(counter);
            
            input.addEventListener('input', function() {
                counter.textContent = this.value.length + ' characters';
                if (this.value.length > 200) {
                    counter.style.color = '#ff6b6b';
                } else if (this.value.length > 100) {
                    counter.style.color = '#ffa726';
                } else {
                    counter.style.color = 'rgba(255, 255, 255, 0.6)';
                }
            });
        }
        
        // Add floating label effect
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                const label = this.parentElement.querySelector('label');
                if (label) {
                    label.style.transform = 'translateY(-25px) scale(0.85)';
                    label.style.color = 'rgba(255, 255, 255, 0.9)';
                }
            } else {
                const label = this.parentElement.querySelector('label');
                if (label) {
                    label.style.transform = 'translateY(0) scale(1)';
                    label.style.color = 'rgba(255, 255, 255, 0.8)';
                }
            }
        });
    });
});

// ===== TEAM CARD HOVER EFFECT =====
document.addEventListener('DOMContentLoaded', function() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ===== CONSOLE LOG FOR DEBUGGING =====
console.log('HireSafe - AI Recruitment Fraud Detection System');
console.log('Website loaded successfully!');
