/**
 * Invisible field that humans never fill. Bots that do are rejected by the API.
 * Positioned off-screen (not display:none) so naive bots still see it.
 */
export function Honeypot() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -left-[10000px] h-px w-px overflow-hidden"
    >
      <label>
        Website
        <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}
