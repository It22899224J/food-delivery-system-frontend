"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { paymentApi } from "@/lib/api-service";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

export default function TransactionsPage() {
  const restaurantId = localStorage.getItem("restaurantId");
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const transactionsPerPage = 10;

  useEffect(() => {
    // Fetch transactions data
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await paymentApi.getById(restaurantId ?? "");
        console.log(`Fetching transactions data`, res);
        // Set transactions data from API response
        if (Array.isArray(res)) {
          setTransactions(res);
        } else if (res && typeof res === "object") {
          // If single object is returned, convert to array
          setTransactions([res]);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter((transaction) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      transaction.orderId?.toLowerCase().includes(searchTerm) ||
      transaction.transactionId?.toLowerCase().includes(searchTerm) ||
      transaction.userId?.toString().toLowerCase().includes(searchTerm) ||
      transaction.paymentMethod?.toLowerCase().includes(searchTerm)
    );
  });

  // Calculate pagination
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );
  const totalPages = Math.ceil(
    filteredTransactions.length / transactionsPerPage
  );

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, "MMM dd, yyyy h:mm a");
    } catch (error) {
      return dateString;
    }
  };

  // Format currency for display
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage all payment transactions
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View and search all payment transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div className="relative w-full max-w-sm">
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-8"
              />
              <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-muted-foreground">Loading transactions...</p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>User ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">
                            {transaction.transactionId?.substring(0, 10)}...
                          </TableCell>
                          <TableCell>
                            {transaction.orderId?.substring(0, 10)}...
                          </TableCell>
                          <TableCell>
                            {formatDate(transaction.createdAt)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(
                              transaction.amount,
                              transaction.currency
                            )}
                          </TableCell>
                          <TableCell className="capitalize">
                            {transaction.paymentMethod?.replace("_", " ")}
                          </TableCell>
                          <TableCell>{transaction.userId}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          {searchQuery
                            ? "No transactions found matching your search."
                            : "No transactions found."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) => Math.max(prev - 1, 1));
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: Math.min(totalPages, 5) }).map(
                        (_, index) => {
                          let pageNumber;

                          // Logic to show pages near current page
                          if (totalPages <= 5) {
                            pageNumber = index + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = index + 1;
                            if (index === 4)
                              return (
                                <PaginationItem key={index}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + index;
                            if (index === 0)
                              return (
                                <PaginationItem key={index}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                          } else {
                            if (index === 0)
                              return (
                                <PaginationItem key={index}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(1);
                                    }}
                                  >
                                    1
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            if (index === 1)
                              return (
                                <PaginationItem key={index}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            if (index === 3)
                              return (
                                <PaginationItem key={index}>
                                  <PaginationEllipsis />
                                </PaginationItem>
                              );
                            if (index === 4)
                              return (
                                <PaginationItem key={index}>
                                  <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(totalPages);
                                    }}
                                  >
                                    {totalPages}
                                  </PaginationLink>
                                </PaginationItem>
                              );
                            pageNumber = currentPage + index - 2;
                          }

                          return (
                            <PaginationItem key={index}>
                              <PaginationLink
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setCurrentPage(pageNumber);
                                }}
                                isActive={currentPage === pageNumber}
                              >
                                {pageNumber}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        }
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            );
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper component for search icon
const SearchIcon = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
};
