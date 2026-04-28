const StatusBadge = ({ sold }) => (
  <span
    className={`inline-flex rounded-md border-2 px-3 py-1 text-xs font-black ${
      sold
        ? 'border-accent bg-accent text-background'
        : 'border-secondary bg-secondary text-primary'
    }`}
  >
    {sold ? 'Sold' : 'Available'}
  </span>
);

export default StatusBadge;
