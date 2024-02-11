import {
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import React, { ChangeEvent } from "react";
import {
  useGetCompaniesQuery,
  useGetContactsQuery,
  useGetLeadsQuery,
} from "../../store/api";
import { ILeads } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Preloader } from "../Preloader";
import { useDispatch } from "react-redux";
import { setView } from "../../store/viewReducer";
import { SortDirection, SortFields } from "../../enums";
import { skipToken } from "@reduxjs/toolkit/query";
import moment from "moment";

export const Leads = () => {
  const { page, limit, sortDirection, sortField } = useSelector(
    (state: RootState) => state.view
  );
  const { data: contacts } = useGetContactsQuery({});
  const { data: companies } = useGetCompaniesQuery(contacts ? {} : skipToken);
  const { data } = useGetLeadsQuery(companies ? { page, limit } : skipToken);
  const dispatch = useDispatch();

  const leads =
    sortField && data?._embedded.leads
      ? data._embedded.leads
          .map((l) => l)
          .sort((a: ILeads, b: ILeads) => {
            const leadA = a[sortField];
            const leadB = b[sortField];

            if (typeof sortField === "number") {
              return sortDirection === SortDirection.desc
                ? Number(leadB) - Number(leadA)
                : Number(leadA) - Number(leadB);
            }

            if (leadA > leadB) {
              return sortDirection === SortDirection.desc ? 1 : -1;
            }
            if (leadA < leadB) {
              return sortDirection === SortDirection.desc ? -1 : 1;
            }
            return 0;
          })
      : data?._embedded.leads;
  const hasNext = data?._links.next;
  const hasPrev = data?._links.prev;

  const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch(
      setView({
        page: 1,
        limit: Number(e.target.value) > 0 ? Number(e.target.value) : 5,
      })
    );
  };

  const handleSort = (name: SortFields) => {
    dispatch(
      setView({
        sortField: name,
        sortDirection:
          sortField !== name
            ? SortDirection.desc
            : sortDirection === SortDirection.desc
            ? SortDirection.asc
            : SortDirection.desc,
      })
    );
  };

  return !data ? (
    <Preloader />
  ) : (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4, px: 2 }}>
      <Box sx={{ maxWidth: "1000px", width: "100%" }}>
        <Typography variant="h4" children="amoCRM" />
        <TableContainer component={Paper} sx={{ p: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell variant="head">
                  <TableSortLabel
                    active={sortField === SortFields.name}
                    direction={
                      sortField === SortFields.name
                        ? sortDirection
                        : SortDirection.desc
                    }
                    onClick={() => handleSort(SortFields.name)}
                  >
                    Название
                  </TableSortLabel>
                </TableCell>
                <TableCell variant="head">
                  <TableSortLabel
                    active={sortField === SortFields.price}
                    direction={
                      sortField === SortFields.price
                        ? sortDirection
                        : SortDirection.desc
                    }
                    onClick={() => handleSort(SortFields.price)}
                  >
                    Бюджет
                  </TableSortLabel>
                </TableCell>
                <TableCell>Компания</TableCell>
                <TableCell>Контакты</TableCell>
                <TableCell>Создано</TableCell>
                <TableCell>Обновлено</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leads && Boolean(leads.length)
                ? leads.map(
                    ({
                      id,
                      name,
                      price,
                      _embedded,
                      created_at,
                      updated_at,
                    }: ILeads) => {
                      const contact = contacts._embedded.contacts.find(
                        ({ id }: { id: number }) =>
                          id === _embedded.contacts[0].id
                      );
                      const company = companies._embedded.companies.find(
                        ({ id }: { id: number }) =>
                          id === _embedded.companies[0].id
                      );
                      const address = company.custom_fields_values.find(
                        ({ field_code }: { field_code: string }) =>
                          field_code === "ADDRESS"
                      );
                      const phone = contact.custom_fields_values.find(
                        ({ field_code }: { field_code: string }) =>
                          field_code === "PHONE"
                      );
                      const email = contact.custom_fields_values.find(
                        ({ field_code }: { field_code: string }) =>
                          field_code === "EMAIL"
                      );
                      return (
                        <TableRow key={id}>
                          <TableCell>{name}</TableCell>
                          <TableCell>{`${price} ₽`}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "grid", gap: 1 }}>
                              <Typography>{company.name}</Typography>
                              {address && (
                                <Box>
                                  <Typography variant="caption">
                                    {address.values[0].value}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: "grid", gap: 1 }}>
                              <Typography>{contact.name}</Typography>
                              {phone && (
                                <Box>
                                  <Typography
                                    component={Link}
                                    href={`tel:${phone.values[0].value}`}
                                    variant="caption"
                                    color="inherit"
                                  >
                                    {phone.values[0].value}
                                  </Typography>
                                </Box>
                              )}
                              {phone && (
                                <Box>
                                  <Typography
                                    component={Link}
                                    href={`mailto:${email.values[0].value}`}
                                    variant="caption"
                                    color="inherit"
                                  >
                                    {email.values[0].value}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {moment.unix(created_at).format("DD.MM.YYYY")}
                          </TableCell>
                          <TableCell
                            align="center"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {moment.unix(updated_at).format("DD.MM.YYYY")}
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )
                : null}
            </TableBody>
            <TableFooter>
              <TableRow>
                {leads && Boolean(leads.length) ? (
                  <TablePagination
                    rowsPerPageOptions={[2, 5, 10, { label: "Все", value: -1 }]}
                    colSpan={6}
                    count={-1}
                    rowsPerPage={limit}
                    page={page - 1}
                    slotProps={{
                      actions: {
                        previousButton: {
                          disabled: !hasPrev,
                          onClick: () => dispatch(setView({ page: page - 1 })),
                        },
                        nextButton: {
                          disabled: !hasNext,
                          onClick: () => dispatch(setView({ page: page + 1 })),
                        },
                      },
                    }}
                    onPageChange={() => {}}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                    labelRowsPerPage="Лимит: "
                    labelDisplayedRows={({ from, to }) => {
                      const ofCount: string = hasNext
                        ? `из более чем ${to}`
                        : "";
                      return `${from}–${to} ${ofCount}`;
                    }}
                  />
                ) : null}
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};
