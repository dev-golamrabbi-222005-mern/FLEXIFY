import React from 'react';

const BeforeAfterPhotos = () => {
    return (
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
            <h3 className="mb-4 font-semibold">Progress Photos</h3>

            <div className="flex gap-4">

            <div>
                <p className="mb-2 text-xs text-gray-500">Before</p>
                <img
                src="https://images.unsplash.com/photo-1599058917212-d750089bc07e"
                className="object-cover w-40 h-40 rounded-lg"
                />
            </div>

            <div>
                <p className="mb-2 text-xs text-gray-500">After</p>
                <img
                src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61"
                className="object-cover w-40 h-40 rounded-lg"
                />
            </div>

            </div>
        </div>
    );
};

export default BeforeAfterPhotos;