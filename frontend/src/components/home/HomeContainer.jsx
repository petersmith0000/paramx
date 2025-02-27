import Logo from "../../assets/logo.svg";
import FRImage from "../../assets/fixed-rates.svg";
import YTImage from "../../assets/yield-trading.svg";
import LPImage from "../../assets/liquidity-providing.svg";

const HomeContainer = () => {
  // Data
  const featuresData = [
    {
      id: 1,
      imgSrc: FRImage,
      alt: "Fixed Rate Image",
    },
    {
      id: 2,
      imgSrc: YTImage,
      alt: "Yield Trading Image",
    },
    {
      id: 3,
      imgSrc: LPImage,
      alt: "Liqudity Providing Image",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full gap-32 bg-black screen-height">
      {/* Logo */}
      <div>
        <img src={Logo} alt="site__logo" loading="lazy" />
      </div>

      {/* Features images */}
      <div className="flex flex-wrap items-center justify-center gap-32">
        {featuresData?.map(({ alt, imgSrc, id }) => (
          <img
            key={id}
            src={imgSrc}
            alt={alt}
            className="duration-200 hover:scale-95"
          />
        ))}
      </div>
    </div>
  );
};

export default HomeContainer;
