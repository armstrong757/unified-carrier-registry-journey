
interface TOCLinkProps {
  id: string;
  title: string;
}

const TOCLink = ({ id, title }: TOCLinkProps) => (
  <a 
    href={`#${id}`} 
    className="text-[#517fa4] hover:text-[#517fa4]/80 transition-colors"
    onClick={(e) => {
      e.preventDefault();
      document.querySelector(`#${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
      setTimeout(() => {
        window.scrollBy(0, -20);
      }, 800);
    }}
  >
    {title}
  </a>
);

export const TableOfContents = () => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4 text-gray-600">Table of Contents</h2>
      <nav className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-gray-600">
        <TOCLink id="what-is-mcs150" title="What is an MCS-150?" />
        <TOCLink id="consequences" title="Non-Compliance Penalties" />
        <TOCLink id="filing-requirements" title="Filing Requirements" />
        <TOCLink id="when-to-file" title="When Must You File?" />
        <TOCLink id="fee-structure" title="Fee Structure" />
      </nav>
    </div>
  );
};
