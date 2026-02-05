// Contact Form Handler for Google Apps Script
// Version: 2.0

class ContactFormHandler 
{
    constructor() {
        this.scriptURL = 'https://script.google.com/macros/s/AKfycbyxF1T6CT4OoIaz9_p6jcACEe-0TJxRMlfeXIffHPzk-yYb6suh6nCkpIL6D-reoZw2hw/exec';
        this.form = document.getElementById('contactForm');
        this.submitBtn = document.getElementById('submitBtn') || 
                        this.form?.querySelector('button[type="submit"]');
        
        this.init();
    }
    
    init() {
        if (!this.form) 
            {
            console.warn('Contact form not found');
            return;
        }
        
        console.log('Contact form handler initialized');
        
        // رویداد submit
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // تست اتصال به سرور
        this.testConnection();
    }
    
    async testConnection() {
        try {
            const response = await fetch(this.scriptURL, {
                method: 'GET',
                mode: 'no-cors' // Google Script نیاز به no-cors دارد
            });
            
            console.log('Server connection test: OK');
            return true;
            
        } catch (error) {
            console.warn('Server connection test failed:', error);
            return false;
        }
    }
    
    async handleSubmit(e) 
    {
        e.preventDefault();
        
        // جمع‌آوری داده‌های فرم
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name') || '',
            email: formData.get('email') || '',
            subject: formData.get('subject') || 'No Subject',
            message: formData.get('message') || '',
            timestamp: new Date().toISOString(),
            source: window.location.href
        };
        
        // اعتبارسنجی
        if (!this.validateData(data)) 
        {   
            //alert(data.stringify())
            //this.showError('Please fill all required fields correctly.');
            //return;
        }
        
        // ارسال داده
        await this.sendData(data);
    }
    
    validateData(data) {
        if (!data.name.trim() || data.name.length < 2) {
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }
        
        if (!data.message.trim() || data.message.length < 10) {
            return false;
        }
        
        return true;
    }
    
    async sendData(data) {
        // ذخیره متن اصلی دکمه
        const originalText = this.submitBtn.innerHTML;
        const originalState = this.submitBtn.disabled;
        
        // تغییر وضعیت دکمه
        this.submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        this.submitBtn.disabled = true;
        
        try {
            // روش 1: استفاده از no-cors (ساده‌تر)
            const response = await fetch(this.scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            // با no-cors نمی‌توانیم response را بخوانیم، اما فرض می‌کنیم موفق بوده
            this.showSuccess('Message sent successfully! I will get back to you soon.');
            
            // ریست فرم
            this.form.reset();
            
            // لاگ در console
            console.log('Form submitted successfully:', data);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showError('Failed to send message. Please try again later.');
            
        } finally {
            // بازگرداندن دکمه به حالت عادی
            setTimeout(() => {
                this.submitBtn.innerHTML = originalText;
                this.submitBtn.disabled = originalState;
            }, 3000);
        }
    }
    
    showSuccess(message) {
        this.showMessage(message, 'success');
    }
    
    showError(message) {
        this.showMessage(message, 'error');
    }
    
    showMessage(message, type = 'info') {
        // حذف پیام قبلی اگر وجود دارد
        const existingMessage = document.getElementById('formFeedback');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // ایجاد پیام جدید
        const messageDiv = document.createElement('div');
        messageDiv.id = 'formFeedback';
        messageDiv.className = `form-feedback ${type}`;
        messageDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // استایل‌های CSS
        messageDiv.style.cssText = `
            margin-top: 1rem;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            background: ${type === 'success' ? '#10b981' : '#ef4444'};
            color: white;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: fadeIn 0.3s ease;
        `;
        
        // اضافه کردن به فرم
        this.form.appendChild(messageDiv);
        
        // حذف خودکار بعد از 5 ثانیه
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => messageDiv.remove(), 300);
        }, 5000);
    }
    
    // متد استاتیک برای تست
    static async testSubmission() 
    {
        const handler = new ContactFormHandler();
        
        const testData = {
            name: "Test User",
            email: "yxMath@gmail.com",
            subject: "Test Message",
            message: "This is a test message from the website.",
            timestamp: new Date().toISOString()
        };
        
        console.log('Testing form submission with data:', testData);
        await handler.sendData(testData);
    }
}

// مقداردهی اولیه هنگام بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    // اضافه کردن CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(-10px); }
        }
        
        .form-feedback {
            animation: fadeIn 0.3s ease;
        }
        
        .form-feedback.success {
            background: #10b981;
        }
        
        .form-feedback.error {
            background: #ef4444;
        }
        
        .form-feedback.info {
            background: #3b82f6;
        }
    `;
    document.head.appendChild(style);
    
    // ایجاد instance از handler
    const contactForm = new ContactFormHandler();
    
    // برای دیباگ در محیط توسعه
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        window.testContactForm = () => ContactFormHandler.testSubmission();
        console.log('Development mode: testContactForm() available for testing');
    }
});

// Export برای استفاده در ماژول‌ها
if (typeof module !== 'undefined' && module.exports) 
{
    module.exports = ContactFormHandler;
}

// Form submission handler
const contactForm = document.getElementById('contactForm');
if (contactForm) 
{
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name') || 'User';
        
        // In a real application, you would send the form data to a server
        // For now, we'll just show a success message
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        //submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        //submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
            
            // Show a more subtle notification
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                padding: 12px 20px;
                border-radius: var(--radius-md);
                box-shadow: var(--shadow-lg);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            `;
            notification.innerHTML = `<i class="fas fa-check-circle"></i> Thank you for your message, ${name}!`;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }, 3000);
        }, 1500);
    });
}


// Handle contact form validation
if (contactForm) 
{
    const inputs = contactForm.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.preventDefault();
            
            // Add error styling
            input.style.borderColor = '#ef4444';
            
            // Show error message
            let errorMsg = input.nextElementSibling;
            if (!errorMsg || !errorMsg.classList.contains('error-message')) {
                errorMsg = document.createElement('div');
                errorMsg.className = 'error-message';
                errorMsg.style.cssText = `
                    color: #ef4444;
                    font-size: 0.875rem;
                    margin-top: 4px;
                `;
                input.parentNode.appendChild(errorMsg);
            }
            
            if (input.validity.valueMissing) {
                errorMsg.textContent = 'This field is required';
            } else if (input.validity.typeMismatch) {
                errorMsg.textContent = 'Please enter a valid email address';
            }
        });
        
        input.addEventListener('input', () => {
            // Remove error styling when user starts typing
            input.style.borderColor = '';
            
            const errorMsg = input.nextElementSibling;
            if (errorMsg && errorMsg.classList.contains('error-message')) {
                errorMsg.remove();
            }
        });
    });
}
