
export const UCRTableOfContents = () => {
  const handleSmoothScroll = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.querySelector(`#${id}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    setTimeout(() => {
      window.scrollBy(0, -20);
    }, 800);
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-600">Table of Contents</h2>
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
        <a href="#what-is-ucr" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={handleSmoothScroll('what-is-ucr')}>
          What is UCR?
        </a>
        <a href="#who-needs" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={handleSmoothScroll('who-needs')}>
          Who Needs to Register?
        </a>
        <a href="#penalties" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={handleSmoothScroll('penalties')}>
          Non-Compliance Penalties
        </a>
        <a href="#participating-states" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={handleSmoothScroll('participating-states')}>
          Participating States
        </a>
        <a href="#fee-structure" className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors" onClick={handleSmoothScroll('fee-structure')}>
          Fee Structure
        </a>
      </nav>
    </div>
  );
};
