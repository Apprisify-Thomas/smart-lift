export default function LoadWidget() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="38px"
          viewBox="0 -960 960 960"
          width="38px"
          fill="currentColor"
        >
          <path d="M240-200h480l-57-400H297l-57 400Zm240-480q17 0 28.5-11.5T520-720q0-17-11.5-28.5T480-760q-17 0-28.5 11.5T440-720q0 17 11.5 28.5T480-680Zm113 0h70q30 0 52 20t27 49l57 400q5 36-18.5 63.5T720-120H240q-37 0-60.5-27.5T161-211l57-400q5-29 27-49t52-20h70q-3-10-5-19.5t-2-20.5q0-50 35-85t85-35q50 0 85 35t35 85q0 11-2 20.5t-5 19.5ZM240-200h480-480Z" />
        </svg>
        Load
      </h2>
      <p className="text-3xl font-extralight">Medium</p>
    </div>
  );
}
