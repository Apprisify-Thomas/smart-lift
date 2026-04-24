export default function Footer() {
  return (
    <div
      className="flex gap-10"
      style={{
        lineHeight: 1.5,
        fontSize: 10,
        opacity: 0.8,
        fontWeight: 100,
      }}
    >
      <div>
        <p>
          Lift accepts max 8 persons <br />
          &copy; Apprisify
        </p>
      </div>

      <div>
        <p>
          Press the destination button and stand to the
          <br /> side to allow space
        </p>
      </div>
    </div>
  );
}
