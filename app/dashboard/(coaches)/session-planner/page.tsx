"use client";

export default function SessionPlanner() {
  const sessions = [
    {
      client: "Rahim",
      time: "10:00 AM",
      type: "Workout Session",
      meeting: "https://meet.google.com/pwh-fetr-kfx",
    },
    {
      client: "Karim",
      time: "02:00 PM",
      type: "Nutrition Consultation",
      meeting: "https://meet.google.com/pwh-fetr-kfx",
    },
  ];

  return (
    <div className="mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4 rounded-2xl shadow p-6">

      <h2 className="text-xl font-bold mb-6 text-[var(--text-primary)]">Session Planner</h2>

      <div className="space-y-4 bg-[var(--card-bg)] p-4 rounded-2xl shadow">

        {sessions.map((session, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-4"
          >

            <div>
              <p className="font-semibold">{session.client}</p>
              <p className="text-sm text-gray-500">
                {session.type} • {session.time}
              </p>
            </div>

            <a
              href={session.meeting}
              target="_blank"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm"
            >
              Join Meeting
            </a>

          </div>
        ))}

      </div>
    </div>
  );
}