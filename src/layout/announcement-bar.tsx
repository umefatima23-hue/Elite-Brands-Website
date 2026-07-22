export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground">
      <div className="container-page flex items-center justify-center gap-2 py-2 text-[0.72rem] tracking-[0.16em] uppercase">
        <span className="hidden sm:inline">Premium Brands</span>
        <span className="hidden sm:inline text-gold">•</span>
        <span>Outlet Prices</span>
        <span className="text-gold">•</span>
        <span>Cash on Delivery Across Pakistan</span>
      </div>
    </div>
  );
}
