type IconProps = {
  icon: string;
  width?: number;
  height?: number;
  viewBoxWidth?: number;
  viewBoxHeight?: number;
  className?: string;
  fill?: string;
  onClick?: () => void;
};
const Icon = ({
  icon,
  width = 20,
  height = 20,
  viewBoxWidth = 24,
  viewBoxHeight = 24,
  className,
  onClick,
}: // fill = "currentColor",
IconProps) => {
  const renderGraphic = () => {
    switch (icon) {
      case "seePassword":
        return (
          <g>
            <path
              d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx={12}
              cy={12}
              r={3}
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );

      case "notSeePassword":
        return (
          <g>
            <path
              d="M2 2L22 22"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818"
              stroke="#000000"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      case "dashboard":
        return (
          <g>
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M29.5 7.5C29.5 5.63623 29.5 4.70435 29.8045 3.96927C30.2105 2.98915 30.9892 2.21046 31.9693 1.80448C32.7044 1.5 33.6362 1.5 35.5 1.5C37.3638 1.5 38.2956 1.5 39.0307 1.80448C40.0108 2.21046 40.7895 2.98915 41.1955 3.96927C41.5 4.70435 41.5 5.63623 41.5 7.5V15.5C41.5 17.3638 41.5 18.2956 41.1955 19.0307C40.7895 20.0108 40.0108 20.7895 39.0307 21.1955C38.2956 21.5 37.3638 21.5 35.5 21.5C33.6362 21.5 32.7044 21.5 31.9693 21.1955C30.9892 20.7895 30.2105 20.0108 29.8045 19.0307C29.5 18.2956 29.5 17.3638 29.5 15.5V7.5Z"
              stroke="#141B34"
              strokeWidth="3"
            />
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M29.5 35.5C29.5 33.6362 29.5 32.7044 29.8045 31.9693C30.2105 30.9892 30.9892 30.2105 31.9693 29.8045C32.7044 29.5 33.6362 29.5 35.5 29.5C37.3638 29.5 38.2956 29.5 39.0307 29.8045C40.0108 30.2105 40.7895 30.9892 41.1955 31.9693C41.5 32.7044 41.5 33.6362 41.5 35.5C41.5 37.3638 41.5 38.2956 41.1955 39.0307C40.7895 40.0108 40.0108 40.7895 39.0307 41.1955C38.2956 41.5 37.3638 41.5 35.5 41.5C33.6362 41.5 32.7044 41.5 31.9693 41.1955C30.9892 40.7895 30.2105 40.0108 29.8045 39.0307C29.5 38.2956 29.5 37.3638 29.5 35.5Z"
              stroke="#141B34"
              strokeWidth="3"
            />

            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M1.5 29.5C1.5 25.7288 1.5 23.8431 2.67157 22.6716C3.84315 21.5 5.72876 21.5 9.5 21.5H13.5C17.2712 21.5 19.1569 21.5 20.3284 22.6716C21.5 23.8431 21.5 25.7288 21.5 29.5V33.5C21.5 37.2712 21.5 39.1569 20.3284 40.3284C19.1569 41.5 17.2712 41.5 13.5 41.5H9.5C5.72876 41.5 3.84315 41.5 2.67157 40.3284C1.5 39.1569 1.5 37.2712 1.5 33.5V29.5Z"
              stroke="#141B34"
              strokeWidth="3"
            />
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M1.5 7.5C1.5 5.63623 1.5 4.70435 1.80448 3.96927C2.21046 2.98915 2.98915 2.21046 3.96927 1.80448C4.70435 1.5 5.63623 1.5 7.5 1.5H15.5C17.3638 1.5 18.2956 1.5 19.0307 1.80448C20.0108 2.21046 20.7895 2.98915 21.1955 3.96927C21.5 4.70435 21.5 5.63623 21.5 7.5C21.5 9.36377 21.5 10.2956 21.1955 11.0307C20.7895 12.0108 20.0108 12.7895 19.0307 13.1955C18.2956 13.5 17.3638 13.5 15.5 13.5H7.5C5.63623 13.5 4.70435 13.5 3.96927 13.1955C2.98915 12.7895 2.21046 12.0108 1.80448 11.0307C1.5 10.2956 1.5 9.36377 1.5 7.5Z"
              stroke="#141B34"
              strokeWidth="3"
            />
          </g>
        );

      // khong dung dc
      case "search":
        return (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        );
      default:
        return null;
    }
  };

  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      {renderGraphic()}
    </svg>
  );
};

export default Icon;
