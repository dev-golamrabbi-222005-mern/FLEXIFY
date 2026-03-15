import React from 'react';

const WorkoutCompletion = () => {
    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
            <h3 className="mb-4 font-semibold">Workout Completion</h3>

            <div className="flex items-center gap-6">

            <div className="text-4xl font-bold text-green-500">
                78%
            </div>

            <div className="flex-1">
                <div className="w-full h-3 bg-gray-200 rounded-full">
                <div className="bg-green-500 h-3 rounded-full w-[78%]"></div>
                </div>
            </div>

            </div>
        </div>
    );
};

export default WorkoutCompletion;