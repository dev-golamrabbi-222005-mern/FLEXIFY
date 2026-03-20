
{
  userRole === "user" &&
    userStatus === "approved" &&
    (() => {
      const userPlan = dbUser?.plan ?? "free"; // "free" | "pro" | "elite"

      if (userPlan === "elite") {
        return (
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-br from-[#7c3aed] to-[#059669] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
              <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm text-lg">
                🏆
              </div>
              <h4 className="mb-1 text-sm font-bold">You&apos;re on Elite!</h4>
              <p className="text-[11px] text-purple-100 mb-1 leading-relaxed">
                You have full access — AI coaching, personal coach, and
                everything in between.
              </p>
              <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">
                Maximum level unlocked 🎉
              </p>
            </div>
          </div>
        );
      }

      if (userPlan === "pro") {
        return (
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-br from-[#f47920] to-[#dc2626] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
              <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                <Trophy size={18} />
              </div>
              <h4 className="mb-1 text-sm font-bold">Upgrade to Elite</h4>
              <p className="text-[11px] text-orange-100 mb-3 leading-relaxed">
                Get a personal coach, custom plans, and direct messaging.
              </p>
              <button
                onClick={() => (window.location.href = "/#pricing")}
                className="w-full bg-white py-2 rounded-xl text-xs font-extrabold hover:bg-orange-50 transition-all active:scale-95"
                style={{ color: "#f47920" }}
              >
                Go Elite →
              </button>
            </div>
          </div>
        );
      }

      // free (default)
      return (
        <div className="px-4 pb-4">
          <div className="bg-gradient-to-br from-[#F59E0B] to-[#059669] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-white/10 rounded-full" />
            <div className="bg-white/20 w-9 h-9 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
              <Trophy size={18} />
            </div>
            <h4 className="mb-1 text-sm font-bold">Upgrade to Pro</h4>
            <p className="text-[11px] text-emerald-100 mb-3 leading-relaxed">
              Unlock AI coaching, full workout library, and advanced analytics.
            </p>
            <button
              onClick={() => (window.location.href = "/#pricing")}
              className="w-full bg-white py-2 rounded-xl text-xs font-extrabold hover:bg-emerald-50 transition-all active:scale-95"
              style={{ color: "var(--primary)" }}
            >
              Upgrade Now
            </button>
          </div>
        </div>
      );
    })();
}
