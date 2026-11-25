import React from 'react';

const BMIProgress = () => {
    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
            <h3 className="mb-4 font-semibold">BMI Progress</h3>

            <div className="space-y-4">

            <div>
                <p className="text-sm text-gray-500">Current BMI</p>
                <p className="text-3xl font-bold">24.5</p>
            </div>

            <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="bg-green-500 h-3 rounded-full w-[65%]"></div>
            </div>

            <p className="text-sm text-gray-400">
                Healthy Range: 18.5 - 24.9
            </p>

            </div>
        </div>
    );
};

export default BMIProgress;