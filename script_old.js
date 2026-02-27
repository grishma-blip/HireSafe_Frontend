document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('predictionForm');
    const resultSection = document.getElementById('result');
    const riskLevel = document.getElementById('riskLevel');
    const riskScore = document.getElementById('riskScore');
    const riskFactors = document.getElementById('riskFactors');

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Form submission with enhanced animations
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Add loading state to button
        const submitBtn = form.querySelector('.predict-btn');
        const btnContent = submitBtn.querySelector('.btn-content');
        const originalContent = btnContent.innerHTML;
        
        btnContent.innerHTML = '<div class="loading"></div><span>Analyzing...</span>';
        submitBtn.disabled = true;
        
        // Simulate processing time for better UX
        setTimeout(() => {
            // Get form values
            const telecommuting = document.getElementById('telecommuting').checked ? 1 : 0;
            const hasLogo = document.getElementById('logo').checked ? 1 : 0;
            const hasQuestions = document.getElementById('questions').checked ? 1 : 0;
            
            // Calculate risk score using the simplified logic
            // let score = tele + (1 - logo) + ques;
            const score = telecommuting + (1 - hasLogo) + hasQuestions;
            
            // Determine risk level
            const isHighRisk = score >= 2;
            
            // Display results with animation
            displayResults(isHighRisk, score, telecommuting, hasLogo, hasQuestions);
            
            // Reset button
            btnContent.innerHTML = originalContent;
            submitBtn.disabled = false;
        }, 1500);
    });

    function displayResults(isHighRisk, score, telecommuting, hasLogo, hasQuestions) {
        // Show result section with animation
        resultSection.classList.remove('hidden');
        
        // Set risk level with enhanced styling
        riskLevel.className = 'risk-level ' + (isHighRisk ? 'high' : 'low');
        
        if (isHighRisk) {
            riskLevel.innerHTML = '<i class="fas fa-exclamation-triangle"></i> 🚨 HIGH RISK';
        } else {
            riskLevel.innerHTML = '<i class="fas fa-check-circle"></i> ✅ LOW RISK';
        }
        
        // Set risk score with animation
        riskScore.innerHTML = `<div class="score-display">Risk Score: <span class="score-number">${score}</span>/3</div>`;
        
        // Identify risk factors
        const factors = [];
        if (telecommuting) {
            factors.push('Offers telecommuting/remote work');
        }
        if (!hasLogo) {
            factors.push('Missing company logo');
        }
        if (hasQuestions) {
            factors.push('Has screening questions');
        }
        
        // Display risk factors with enhanced styling
        let factorsHTML = '<h4><i class="fas fa-list-check"></i> Risk Factors Identified:</h4><ul class="factors-list">';
        if (factors.length > 0) {
            factors.forEach(factor => {
                factorsHTML += `<li><i class="fas fa-chevron-right"></i> ${factor}</li>`;
            });
        } else {
            factorsHTML += '<li><i class="fas fa-check"></i> No significant risk factors detected</li>';
        }
        factorsHTML += '</ul>';
        
        // Add detailed explanation
        if (isHighRisk) {
            factorsHTML += `
                <div class="risk-explanation high-risk">
                    <div class="explanation-header">
                        <i class="fas fa-shield-alt"></i>
                        <strong>Warning:</strong>
                    </div>
                    <p>This job posting shows characteristics commonly associated with recruitment scams. Exercise extreme caution and verify the company legitimacy before proceeding.</p>
                    <div class="recommendation-list">
                        <div><i class="fas fa-search"></i> Research the company thoroughly</div>
                        <div><i class="fas fa-user-check"></i> Verify contact information</div>
                        <div><i class="fas fa-money-check"></i> Never pay for job opportunities</div>
                    </div>
                </div>
            `;
        } else {
            factorsHTML += `
                <div class="risk-explanation low-risk">
                    <div class="explanation-header">
                        <i class="fas fa-check-circle"></i>
                        <strong>Good:</strong>
                    </div>
                    <p>This job posting appears to have lower risk characteristics. However, always remain vigilant and conduct proper research.</p>
                    <div class="recommendation-list">
                        <div><i class="fas fa-clipboard-check"></i> Still verify company details</div>
                        <div><i class="fas fa-file-contract"></i> Review employment terms carefully</div>
                    </div>
                </div>
            `;
        }
        
        riskFactors.innerHTML = factorsHTML;
        
        // Smooth scroll to results with offset
        setTimeout(() => {
            resultSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'nearest',
                inline: 'nearest'
            });
        }, 100);
    }

    // Enhanced checkbox interactions
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const label = this.closest('.form-label');
            const icon = label.querySelector('.form-icon i');
            
            if (this.checked) {
                label.style.borderColor = 'var(--primary-color)';
                label.style.background = 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))';
                
                // Add icon animation
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    icon.style.transform = 'scale(1)';
                }, 200);
            } else {
                label.style.borderColor = 'transparent';
                label.style.background = 'var(--light-color)';
            }
        });
    });

    // Enhanced button interactions
    const predictBtn = document.querySelector('.predict-btn');
    predictBtn.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.btn-content i');
        if (icon) {
            icon.style.transform = 'rotate(10deg) scale(1.1)';
        }
    });

    predictBtn.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.btn-content i');
        if (icon) {
            icon.style.transform = 'rotate(0deg) scale(1)';
        }
    });

    // Add parallax effect to hero section - Removed for clean look
    // window.addEventListener('scroll', () => {
    //     const scrolled = window.pageYOffset;
    //     const heroContent = document.querySelector('.hero-content');
    //     const heroVisual = document.querySelector('.hero-visual');
    //     
    //     if (heroContent && scrolled < 800) {
    //         heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
    //         heroContent.style.opacity = 1 - (scrolled * 0.001);
    //     }
    //     
    //     if (heroVisual && scrolled < 800) {
    //         heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    //     }
    // });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about-card, .tech-stack, .feature-card, .team-member, .step-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add typing effect to hero title - Removed for clean look
    // const heroTitle = document.querySelector('.hero-title');
    // if (heroTitle) {
    //     const text = heroTitle.innerHTML;
    //     heroTitle.innerHTML = '';
    //     let index = 0;
    //     
    //     function typeWriter() {
    //         if (index < text.length) {
    //             heroTitle.innerHTML = text.slice(0, index + 1);
    //             index++;
    //             setTimeout(typeWriter, 50);
    //         }
    //     }
    //     
    //     setTimeout(typeWriter, 500);
    // }

    // Add subtle animation to stats (removed floating)
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach((stat, index) => {
        stat.style.animationDelay = `${index * 0.2}s`;
        stat.style.animation = 'fadeIn 1s ease-out';
    });
});

// Reset form function
function resetForm() {
    const form = document.getElementById('predictionForm');
    const resultSection = document.getElementById('result');
    
    // Reset form with animation
    form.style.transform = 'scale(0.95)';
    setTimeout(() => {
        form.reset();
        form.style.transform = 'scale(1)';
        
        // Reset checkbox styles
        document.querySelectorAll('.form-label').forEach(label => {
            label.style.borderColor = 'transparent';
            label.style.background = 'var(--light-color)';
        });
        
        // Hide results
        resultSection.classList.add('hidden');
        
        // Scroll back to form
        form.scrollIntoView({ behavior: 'smooth' });
    }, 200);
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
        const form = document.getElementById('predictionForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
});

// Add hover sound effect (visual feedback)
document.querySelectorAll('button, .form-label').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
});
