import { ConfigProvider, Select } from "antd";

interface SelectChangeColorProps {
  value: string;
  colorsOptions: { label: string; value: string }[];
  onChange: (value: string) => void;
}

export const SelectChangeColor: React.FC<SelectChangeColorProps> = ({
  value,
  colorsOptions,
  onChange,
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            hoverBorderColor: "#8E8E8E",
            activeBorderColor: "#8E8E8E",
            activeOutlineColor: "none",
            colorTextPlaceholder: "#a2a2a2",
            colorBorder: "#a2a2a2",
            colorText: "#660099",
          },
        },
      }}
    >
      <div className="flex flex-col gap-4">
        <Select
          className="w-26 "
          showSearch
          value={value || " "}
          onChange={onChange}
          filterOption={(input, option) => {
            const label = option?.label;
            if (typeof label !== "string") return false;
            return label.toLowerCase().includes(input.toLowerCase());
          }}
          options={colorsOptions}
        />
      </div>
    </ConfigProvider>
  );
};
