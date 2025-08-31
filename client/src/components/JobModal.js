import { Form, Modal } from "antd";


function JobModal(props) {

  const { title, open, onCancel, footer, onSubmit, children } =   props;
  const [form] = Form.useForm();
  return (
    
    <Modal
        title={title}
        open={open}
        onCancel={onCancel}
        footer={footer}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {children}
      </Form>
      </Modal>
  );
}

export default JobModal;
