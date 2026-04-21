export default function BackgroundLoop() {
  return (
    <>
      <div className="background-blur absolute left-0 top-0 bottom-0 right-0"></div>
      <div className="absolute left-0 right-0 top-0 bottom-0 -z-10 flex justify-center">
        <video
          src="http://localhost:8083/animations/15674175_3840_2160_30fps.mp4"
          autoPlay
          loop
          muted
          width="100%"
          height="auto"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </>
  );
}
