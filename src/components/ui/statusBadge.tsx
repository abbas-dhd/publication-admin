type StatusBadgeProps = {
  statusText?: string;
  textColor?: string;
  backgroundColor?: string;
};
const StatusBadge = ({
  backgroundColor = "#FAFAFA",
  statusText = "N/A", // gray color
  textColor = "#414651",
}: StatusBadgeProps) => {
  return (
    <div
      className="py-1 px-3 rounded-xl text-center w-fit"
      style={{
        backgroundColor,
        color: textColor,
        border: `1px solid ${textColor}65`,
      }}
    >
      <span>{statusText}</span>
    </div>
  );
};

export default StatusBadge;
