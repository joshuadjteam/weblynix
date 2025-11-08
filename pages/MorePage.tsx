import React from 'react';

const MorePage: React.FC = () => {
    return (
        <div className="container mx-auto">
            <div className="bg-white dark:bg-lynix-dark-blue p-8 rounded-lg shadow-md text-center">
                <h1 className="text-3xl font-bold mb-4">More From Lynix</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Discover even more tools and services coming soon to the Lynix ecosystem.
                </p>
            </div>
        </div>
    );
};

export default MorePage;