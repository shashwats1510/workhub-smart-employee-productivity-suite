const NotFound = () => {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 sm:py-32 lg:px-8">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-primary-950/20 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[120px]"></div>
      </div>

      <div className="relative z-10 text-center max-w-xl">
        <p className="text-base font-semibold tracking-widest uppercase text-accent-400">
          Error 404
        </p>

        <h1 className="mt-4 text-5xl font-bold tracking-tight sm:text-9xl bg-clip-text text-transparent bg-linear-to-b from-text-primary to-primary-400">
          oopsies
        </h1>

        <div className="mt-8 space-y-4">
          <p className="text-xl font-medium text-text-primary sm:text-2xl">
            The page you're looking for doesn't exist.
          </p>
          <p className="text-base leading-7 text-text-secondary">
            It seems the link is broken or the page has been moved to a new
            coordinate. Don't worry—our navigation systems can get you back on
            track.
          </p>
        </div>

        <div className="mt-12 flex flex-col items-center justify-center gap-y-4 sm:flex-row sm:gap-x-6">
          <a
            href="/"
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-linear-to-r from-primary-500 to-secondary hover:from-primary-600 hover:to-secondary-hover rounded-lg shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)]"
          >
            Go back home
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </a>

          <a
            href="/support"
            className="text-sm font-semibold leading-6 text-text-primary hover:text-accent-400 transition-colors duration-200 flex items-center"
          >
            Contact support{" "}
            <span aria-hidden="true" className="ml-1">
              &rarr;
            </span>
          </a>
        </div>

        <div className="mt-16 border-t border-border-subtle pt-8">
          <p className="text-xs text-text-muted uppercase tracking-widest">
            System Status:{" "}
            <span className="text-success">All Systems Operational</span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
