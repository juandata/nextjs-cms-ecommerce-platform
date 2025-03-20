import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { deleteData } from "~/lib/clientFunctions";
import GlobalModal from "../Ui/Modal/modal";
import c from "./addressBook.module.css";
import EditCustomer from "./addressEditForm";
import NewCustomer from "./addressForm";
import PageLoader from "../Ui/pageLoader";
import Card from "../Ui/Card";
import { PencilSquare, Trash3 } from "@styled-icons/bootstrap";

const ManageAddressBook = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addNew, setAddNew] = useState(false);
  const [selected, setSelected] = useState({});
  const [data, setData] = useState({});
  const updateRef = useRef();

  const handleCloseModal = () => {
    setIsOpen(false);
    setSelected({});
    updateRef.current.update();
  };

  function edit(id) {
    const resp = data.user?.address.find((x) => x._id === id);
    setSelected(resp || {});
    setIsOpen(true);
  }

  const deleteAddress = async (id) => {
    try {
      const data = {
        id,
      };
      const response = await deleteData(`/api/profile/address`, data);
      response.success
        ? (toast.success("Address has been removed"),
          updateRef.current.update())
        : toast.error("Something went wrong (500)");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Card title="Address Book">
      <PageLoader
        url={`/api/profile/address`}
        setData={setData}
        ref={updateRef}
      >
        <div className="d-flex w-100 justify-content-md-end my-1">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => setAddNew(true)}
          >
            Add New Address
          </button>
        </div>
        <div className={c.container}>
          {data.user?.address.length === 0 && (
            <p className="text-center p-3 w-100">You have no saved address</p>
          )}
          {data.user?.address.map((x, idx) => (
            <div key={idx} className={c.card}>
              <span>
                <b className="text-primary">{x.addressTitle}</b>
              </span>
              <span>{x.name}</span>
              <span>{x.phone}</span>
              <span>{`${x.house} ${x.state} ${x.zipCode} ${x.country}`}</span>
              {x.addressType === "main address" && (
                <div className="badge bg-primary">default</div>
              )}
              <div className={c.button}>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => edit(x._id)}
                >
                  <PencilSquare width={20} height={20} />
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteAddress(x._id)}
                >
                  <Trash3 width={20} height={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <GlobalModal
          small={false}
          isOpen={isOpen}
          handleCloseModal={handleCloseModal}
        >
          <EditCustomer data={selected} close={handleCloseModal} />
        </GlobalModal>
        <GlobalModal
          small={false}
          isOpen={addNew}
          handleCloseModal={() => {
            setAddNew(false);
            updateRef.current.update();
          }}
        >
          <NewCustomer />
        </GlobalModal>
      </PageLoader>
    </Card>
  );
};

export default ManageAddressBook;
