import {
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { IoBagHandle } from "react-icons/io5";
import { useParams } from "react-router-dom";

//internal import
import PageTitle from "@/components/Typography/PageTitle";
import CustomerOrderTable from "@/components/customer/CustomerOrderTable";
import Loading from "@/components/preloader/Loading";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import OrderServices from "@/services/OrderServices";

const CustomerOrder = () => {
  const { id } = useParams();

  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderCustomer(id)
  );

  const { handleChangePage, totalResults, resultsPerPage, dataTable } =
    useFilter(data);

  return (
    <>
      <PageTitle>{"CustomerOrderList"}</PageTitle>

      {loading && <Loading loading={loading} />}
      {!error && !loading && dataTable.length === 0 && (
        <div className="w-full bg-white rounded-md dark:bg-gray-800">
          <div className="p-8 text-center">
            <span className="flex justify-center my-30 text-red-500 font-semibold text-6xl">
              <IoBagHandle />
            </span>
            <h2 className="font-medium text-base mt-4 text-gray-600">
              {"CustomerOrderEmpty"}
            </h2>
          </div>
        </div>
      )}

      {data.length > 0 && !error && !loading ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell> {"CustomerOrderId"} </TableCell>
                <TableCell>{"CustomerOrderTime"}</TableCell>
                <TableCell>{"CustomerShippingAddress"}</TableCell>
                <TableCell>{"Phone"} </TableCell>
                <TableCell>{"CustomerOrderMethod"} </TableCell>
                <TableCell>{"Amount"}</TableCell>
                <TableCell className="text-center">
                  {"CustomerOrderStatus"}
                </TableCell>
                <TableCell className="text-center">
                  {"CustomerOrderAction"}
                </TableCell>
              </tr>
            </TableHeader>
            <CustomerOrderTable orders={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : null}
    </>
  );
};

export default CustomerOrder;
