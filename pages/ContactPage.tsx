
import React from 'react';
import PulsingQuestionIcon from '../components/PulsingQuestionIcon';

const ContactPage: React.FC = () => {
    return (
        <div className="container mx-auto max-w-2xl text-center">
            <div className="bg-white dark:bg-lynix-dark-blue p-8 rounded-2xl shadow-lg">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-lynix-blue dark:text-lynix-light-blue">Get in Touch</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    We're here to help and answer any question you might have.
                </p>
                <div className="space-y-4 text-left mx-auto max-w-sm text-gray-800 dark:text-gray-200">
                    <div className="flex items-center">
                        <span className="font-bold w-20">Email:</span>
                        <a href="mailto:admin@lynixity.x10.bz" className="hover:text-lynix-orange">admin@lynixity.x10.bz</a>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold w-20">Phone:</span>
                        <span>+1 (647) 247 - 4844</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold w-20">TalkID:</span>
                        <span>0470055990</span>
                    </div>
                </div>
            </div>
            <PulsingQuestionIcon />
        </div>
    );
};

export default ContactPage;
