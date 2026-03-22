export default function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center space-y-2">
          <p className="text-gray-400 text-sm">
            Built by a Last War player, for Last War players
          </p>
          <p className="text-gray-500 text-xs">
            Not affiliated with Last War: Survival or FunFly Inc.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">
              Contact
            </a>
            <span>·</span>
            <a
              href="https://www.perplexity.ai/computer"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-300 transition-colors"
            >
              Created with Perplexity Computer
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
