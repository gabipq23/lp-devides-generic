import { Button, ConfigProvider } from "antd";
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space } from "antd";

export const Count: React.FC<{
  count: number;
  onChange: (newCount: number) => void;
  onRemove: () => void; // nova prop para remover item
}> = ({ count, onChange, onRemove }) => {
  const increase = () => {
    onChange(count + 1);
  };
  const decline = () => {
    const newCount = Math.max(count - 1, 1);
    onChange(newCount);
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: "#660099",
            colorPrimaryHover: "#883fa2",
          },
        },
      }}
    >
      <Space direction="horizontal">
        {count === 1 ? (
          <Button
            type="primary"
            style={{
              width: "24px",
              height: "24px",
            }}
            onClick={onRemove}
            icon={<DeleteOutlined style={{ fontSize: 14 }} />}
          />
        ) : (
          <Button
            type="primary"
            variant="solid"
            style={{
              width: "24px",
              height: "24px",
              color: "white",
            }}
            onClick={decline}
            icon={<MinusOutlined style={{ fontSize: 14 }} />}
          />
        )}
        <div className="flex items-center justify-center text-neutral-700 font-semibold">
          {count}
        </div>
        <Button
          type="primary"
          variant="solid"
          style={{
            width: "24px",
            height: "24px",
            color: "white",
          }}
          onClick={increase}
          icon={<PlusOutlined style={{ fontSize: 14 }} />}
        />
      </Space>
    </ConfigProvider>
  );
};
