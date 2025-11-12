type InfoRowProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

export default function InfoRow({ label, value, highlight = false }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between py-[5px] text-[13px] text-gray-600 first:pt-0 last:pb-0">
      <span className={highlight ? "text-primary-600" : "text-gray-600"}>{label}</span>
      <span
        className={`text-[15px] ${
          highlight ? "font-semibold text-primary-600" : "font-medium text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

