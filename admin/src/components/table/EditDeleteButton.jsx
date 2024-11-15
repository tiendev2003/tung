import { FiEdit, FiTrash2, FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

import Tooltip from "@/components/tooltip/Tooltip";

const EditDeleteButton = ({
  id,
  title,
  handleUpdate,
  handleModalOpen,
  isCheck,
  product,
  parent,
  children,
}) => {
   return (
    <>
      <div className="flex justify-end text-right">
        {children?.length > 0 ? (
          <>
            <Link
              to={`/categories/${parent?._id}`}
              className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 focus:outline-none"
            >
              <Tooltip
                id="view"
                Icon={FiZoomIn}
                title={"View"}
                bgColor="#10B981"
              />
            </Link>

            <button
              disabled={isCheck?.length > 0}
              onClick={() => handleUpdate(id)}
              className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 focus:outline-none"
            >
              <Tooltip
                id="edit"
                Icon={FiEdit}
                title={"Edit"}
                bgColor="#10B981"
              />
            </button>
          </>
        ) : (
          <button
            disabled={isCheck?.length > 0}
            onClick={() => handleUpdate(id)}
            className="p-2 cursor-pointer text-gray-400 hover:text-emerald-600 focus:outline-none"
          >
            <Tooltip
              id="edit"
              Icon={FiEdit}
              title={"Edit"}
              bgColor="#10B981"
            />
          </button>
        )}

        <button
          disabled={isCheck?.length > 0}
          onClick={() => handleModalOpen(id, title, product)}
          className="p-2 cursor-pointer text-gray-400 hover:text-red-600 focus:outline-none"
        >
          <Tooltip
            id="delete"
            Icon={FiTrash2}
            title={"Delete"}
            bgColor="#EF4444"
          />
        </button>
      </div>
    </>
  );
};

export default EditDeleteButton;
