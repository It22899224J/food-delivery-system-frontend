"use client";

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Order, OrderStatus } from '@/types';
import { 
  MoreVertical, 
  Clock, 
  X, 
  Check, 
  Utensils, 
  ArrowRight,
  Phone
} from 'lucide-react';
import { ordersApi } from '@/lib/api-service';


interface OrdersListProps {
  orders: Order[];
}

export function OrdersList({ orders }: OrdersListProps) {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orderDetailId, setOrderDetailId] = useState<string | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState('30');
  const [rejectReason, setRejectReason] = useState('');
  const [currentOrderId, setCurrentOrderId] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const restaurantId = localStorage.getItem("restaurantId");

  const updateStatus = async (id: string, status: OrderStatus) => {
    setIsUpdating(true);
    try {
      const response = await ordersApi.updateStatus(id, {status, changedBy:restaurantId});
      if (response) {
        
        
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(false);
      window.location.reload();
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    if (selectedOrders.includes(orderId)) {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    } else {
      setSelectedOrders([...selectedOrders, orderId]);
    }
  };

  const handleAcceptOrder = (orderId: string) => {
    setCurrentOrderId(orderId);
    setAcceptDialogOpen(true);
  };

  const handleRejectOrder = (orderId: string) => {
    setCurrentOrderId(orderId);
    setRejectDialogOpen(true);
  };

  const confirmAcceptOrder = async () => {
    await updateStatus(currentOrderId, 'CONFIRMED');
    setAcceptDialogOpen(false);
  };

  const confirmRejectOrder = async () => {
    await updateStatus(currentOrderId, 'CANCELLED');
    setRejectDialogOpen(false);
  };

  const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
    await updateStatus(orderId, status);
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:border-yellow-800';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800';
      case 'preparing':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:border-purple-800';
      case 'ready_for_pickup':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900 dark:text-indigo-300 dark:border-indigo-800';
      case 'out_for_delivery':
        return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:border-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-300 dark:border-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const formatStatusLabel = (status: string) => {
    switch (status) {
      case 'ready_for_pickup':
        return 'Ready for Pickup';
      case 'out_for_delivery':
        return 'Out for Delivery';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      'PENDING': 'CONFIRMED',
      'CONFIRMED': 'PREPARING',
      'PREPARING': 'READY_FOR_PICKUP',
      'READY_FOR_PICKUP': 'OUT_FOR_DELIVERY',
      'OUT_FOR_DELIVERY': 'DELIVERED',
      'DELIVERED': null,
      'CANCELLED': null
    };
    
    return statusFlow[currentStatus];
  };

  const getOrderDetail = () => {
    if (!orderDetailId) return null;
    return orders.find(order => order.id === orderDetailId);
  };

  const orderDetail = getOrderDetail();

  return (
    <>
      <div className="space-y-4">
        {selectedOrders.length > 0 && (
          <div className="flex items-center justify-between p-2 px-4 rounded-lg border bg-muted/50">
            <span>{selectedOrders.length} orders selected</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedOrders([])}>
                Clear
              </Button>
              <Button size="sm">Batch Update</Button>
            </div>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg">
            <p className="text-muted-foreground mb-2">No orders found</p>
            <p className="text-sm text-muted-foreground">
              Try adjusting your filters or search criteria
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b bg-muted/50">
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">
                      <Checkbox
                        checked={selectedOrders.length === orders.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedOrders(orders.map(order => order.id));
                          } else {
                            setSelectedOrders([]);
                          }
                        }}
                      />
                    </th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Order ID</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Items</th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Total</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                    <th className="h-10 px-4 text-left align-middle font-medium text-muted-foreground">Created At</th>
                    <th className="h-10 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className={cn(
                        "border-b transition-colors hover:bg-muted/50",
                        selectedOrders.includes(order.id) && "bg-muted"
                      )}
                    >
                      <td className="p-4 align-middle">
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => toggleOrderSelection(order.id)}
                        />
                      </td>
                      <td className="p-4 align-middle font-medium">
                        <Button variant="link" className="p-0 h-auto" onClick={() => setOrderDetailId(order.id)}>
                          {order.id}
                        </Button>
                      </td>
                      <td className="p-4 align-middle">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </td>
                      <td className="p-4 align-middle text-right font-medium">
                        ${order.totalAmount.toFixed(2)}
                      </td>
                      <td className="p-4 align-middle">
                        <Badge className={cn("capitalize", getStatusBadgeStyles(order.status))}>
                          {formatStatusLabel(order.status)}
                        </Badge>
                      </td>
                      <td className="p-4 align-middle text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-4 align-middle text-right">
                        <div className="flex justify-end items-center gap-2">
                          {order.status === 'PENDING' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 text-green-600 border-green-200 hover:text-green-700 hover:bg-green-50 hover:border-green-300 dark:text-green-400 dark:border-green-950 dark:hover:bg-green-950"
                                onClick={() => handleAcceptOrder(order.id)}
                                disabled={isUpdating}
                              >
                                <Check className="h-4 w-4" />
                                {isUpdating && currentOrderId === order.id ? 'Processing...' : 'Accept'}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 gap-1 text-red-600 border-red-200 hover:text-red-700 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-950 dark:hover:bg-red-950"
                                onClick={() => handleRejectOrder(order.id)}
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                                {isUpdating && currentOrderId === order.id ? 'Processing...' : 'Reject'}
                              </Button>
                            </>
                          )}
                          
                          {order.status !== 'PENDING' && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-8 gap-1"
                              onClick={() => {
                                const nextStatus = getNextStatus(order.status as OrderStatus);
                                if (nextStatus) {
                                  handleStatusUpdate(order.id, nextStatus);
                                }
                              }}
                              disabled={isUpdating}
                            >
                              <ArrowRight className="h-4 w-4" />
                              {(() => {
                                const nextStatus = getNextStatus(order.status as OrderStatus);
                                return nextStatus ? formatStatusLabel(nextStatus) : '';
                              })()}
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => setOrderDetailId(order.id)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Phone className="mr-2 h-4 w-4" /> Call Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                Print Receipt
                              </DropdownMenuItem>
                              {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600 dark:text-red-400" 
                                    onClick={() => handleRejectOrder(order.id)}
                                    disabled={isUpdating}
                                  >
                                    Cancel Order
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Order Details Dialog */}
      {orderDetail && (
        <Dialog open={!!orderDetailId} onOpenChange={() => setOrderDetailId(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex justify-between items-center">
                <span>Order {orderDetail.id}</span>
                <Badge className={cn("capitalize", getStatusBadgeStyles(orderDetail.status))}>
                  {formatStatusLabel(orderDetail.status)}
                </Badge>
              </DialogTitle>
              <DialogDescription>
                Placed on {formatDate(orderDetail.createdAt)}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Customer Information</h3>
                <div className="space-y-1 text-sm">
                  <p><span className="font-medium">Delivery Address:</span> {orderDetail.deliveryAddress}</p>
                  <p><span className="font-medium">Payment Method:</span> {orderDetail.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Order Timeline</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 rounded-full bg-green-500"></div>
                    <div>
                      <p className="font-medium">Order Placed</p>
                      <p className="text-muted-foreground">{formatDate(orderDetail.createdAt)}</p>
                    </div>
                  </div>
                  
                  {orderDetail.status !== 'PENDING' && orderDetail.status !== 'CANCELLED' && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-blue-500"></div>
                      <div>
                        <p className="font-medium">Order Accepted</p>
                        <p className="text-muted-foreground">{formatDate(orderDetail.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {['delivered', 'out_for_delivery', 'ready_for_pickup', 'preparing'].includes(orderDetail.status) && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-purple-500"></div>
                      <div>
                        <p className="font-medium">Preparing</p>
                        <p className="text-muted-foreground">{formatDate(orderDetail.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {['delivered', 'out_for_delivery', 'ready_for_pickup'].includes(orderDetail.status) && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-indigo-500"></div>
                      <div>
                        <p className="font-medium">Ready for Pickup</p>
                        <p className="text-muted-foreground">{formatDate(orderDetail.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {['delivered', 'out_for_delivery'].includes(orderDetail.status) && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-orange-500"></div>
                      <div>
                        <p className="font-medium">Out for Delivery</p>
                        <p className="text-muted-foreground">{formatDate(orderDetail.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {orderDetail.status === 'DELIVERED' && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-green-500"></div>
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p className="text-muted-foreground">{formatDate(orderDetail.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                  
                  {orderDetail.status === 'CANCELLED' && (
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 mt-0.5 rounded-full bg-red-500"></div>
                      <div>
                        <p className="font-medium">Cancelled</p>
                        <p className="text-muted-foreground">{formatDate(orderDetail.updatedAt)}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="border rounded-md divide-y">
                {orderDetail.items.map((item) => (
                  <div key={item.id} className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-muted rounded-md flex items-center justify-center">
                        <Utensils className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${orderDetail.totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span>${orderDetail.deliveryFee.toFixed(2)}</span>
              </div>
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0">
              {orderDetail.status === 'PENDING' && (
                <>
                  <Button variant="outline" onClick={() => handleRejectOrder(orderDetail.id)} disabled={isUpdating}>
                    <X className="mr-2 h-4 w-4" />
                    {isUpdating && currentOrderId === orderDetail.id ? 'Processing...' : 'Reject'}
                  </Button>
                  <Button onClick={() => handleAcceptOrder(orderDetail.id)} disabled={isUpdating}>
                    <Check className="mr-2 h-4 w-4" />
                    {isUpdating && currentOrderId === orderDetail.id ? 'Processing...' : 'Accept'}
                  </Button>
                </>
              )}
              
              {orderDetail.status !== 'PENDING' && orderDetail.status !== 'DELIVERED' && orderDetail.status !== 'CANCELLED' && (
                <Button 
                  onClick={() => {
                    const nextStatus = getNextStatus(orderDetail.status as OrderStatus);
                    if (nextStatus) {
                      handleStatusUpdate(orderDetail.id, nextStatus);
                      setOrderDetailId(null);
                    }
                  }}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Processing...' : `Mark as ${formatStatusLabel(getNextStatus(orderDetail.status as OrderStatus) || '')}`}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Accept Order Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Accept Order</DialogTitle>
            <DialogDescription>
              Set an estimated preparation time for this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="estimated-time">Estimated Preparation Time (minutes)</Label>
              <Select
                value={estimatedTime}
                onValueChange={setEstimatedTime}
              >
                <SelectTrigger id="estimated-time">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="20">20 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAcceptDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button onClick={confirmAcceptOrder} disabled={isUpdating}>
              {isUpdating ? 'Processing...' : 'Accept Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Order Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Order</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this order.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">Reason</Label>
              <Select
                value={rejectReason}
                onValueChange={setRejectReason}
              >
                <SelectTrigger id="reject-reason">
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="out_of_stock">Out of stock</SelectItem>
                  <SelectItem value="closed">Restaurant closed</SelectItem>
                  <SelectItem value="too_busy">Too busy to fulfill</SelectItem>
                  <SelectItem value="out_of_delivery_range">Out of delivery range</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {rejectReason === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="reject-notes">Additional Notes</Label>
                <Input 
                  id="reject-notes" 
                  placeholder="Enter details..."
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={isUpdating}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRejectOrder} disabled={isUpdating}>
              {isUpdating ? 'Processing...' : 'Reject Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}