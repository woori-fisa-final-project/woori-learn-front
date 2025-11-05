const loadingImage = "http://localhost:3845/assets/e2ae3b6f849b0f062472d453f46c0a77c5f0f3bd.png";

export default function Splash() {
  return (
    <div className="bg-white relative w-full h-screen px-5 pt-[60px]">
      <div className="relative w-full h-[219px] mt-[213px]">
        <img
          alt="로딩 중"
          className="w-full h-full object-cover"
          src={loadingImage}
        />
      </div>
    </div>
  );
}

