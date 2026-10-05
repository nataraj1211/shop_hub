import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Order, CartItem } from '@/types/product';
import { toast } from '@/components/ui/sonner';

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], shippingAddress: Order['shippingAddress'], customerEmail: string, paymentMethod?: 'upi' | 'card' | 'cod') => Order;
  cancelOrder: (orderId: string) => boolean;
  updateOrderStatus: (orderId: string, status: Order['status']) => boolean;
  markOrderAsSeen: (orderId: string) => void;
  getOrdersByEmail: (email: string) => Order[];
  getAllOrders: () => Order[];
  newOrdersCount: number;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const savedOrders = localStorage.getItem('shophub_orders');
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        return parsed.map((order: Order) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          isNew: order.isNew !== undefined ? order.isNew : order.status === 'confirmed',
        }));
      } catch {
        return [];
      }
    }
    return [];
  });

  const saveOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    localStorage.setItem('shophub_orders', JSON.stringify(newOrders));
  };

  const createOrder = (
    items: CartItem[], 
    shippingAddress: Order['shippingAddress'], 
    customerEmail: string,
    paymentMethod: 'upi' | 'card' | 'cod' = 'upi'
  ): Order => {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items,
      total,
      status: 'confirmed',
      createdAt: new Date(),
      customerEmail,
      shippingAddress,
      paymentMethod,
      isNew: true,
    };

    const newOrders = [newOrder, ...orders];
    saveOrders(newOrders);

    const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
    toast.success('🎉 Your Order is Confirmed!', {
      description: `Order ID: ${newOrder.id} • ${itemCount} item(s) • ₹${total.toLocaleString('en-IN')}. Thank you for shopping on ShopHub!`,
      duration: 6000,
    });

    // Browser notification (if permitted)
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const send = () => {
        try {
          new Notification('ShopHub – Your Order is Confirmed!', {
            body: `Order ${newOrder.id} placed successfully. Total: ₹${total.toLocaleString('en-IN')}.`,
            icon: '/favicon.ico',
          });
        } catch {}
      };
      if (Notification.permission === 'granted') {
        send();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((p) => p === 'granted' && send());
      }
    }

    return newOrder;
  };

  const cancelOrder = (orderId: string): boolean => {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      toast.error('Order not found');
      return false;
    }

    const order = orders[orderIndex];
    if (order.status === 'delivered' || order.status === 'cancelled') {
      toast.error('Cannot cancel this order');
      return false;
    }

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = { ...order, status: 'cancelled', isNew: false };
    saveOrders(updatedOrders);
    toast.success('Order cancelled successfully');
    return true;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']): boolean => {
    const orderIndex = orders.findIndex((o) => o.id === orderId);
    if (orderIndex === -1) {
      toast.error('Order not found');
      return false;
    }

    const updatedOrders = [...orders];
    updatedOrders[orderIndex] = { 
      ...updatedOrders[orderIndex], 
      status,
      // Once status transitions away from confirmed, unmark as new
      isNew: status === 'confirmed' ? updatedOrders[orderIndex].isNew : false,
    };
    saveOrders(updatedOrders);
    toast.success(`Order status updated to ${status}`);
    return true;
  };

  const markOrderAsSeen = (orderId: string) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, isNew: false } : o));
    saveOrders(updated);
  };

  const getOrdersByEmail = (email: string): Order[] => {
    const cleanEmail = email.trim().toLowerCase();
    return orders.filter((o) => o.customerEmail?.toLowerCase() === cleanEmail);
  };

  const getAllOrders = (): Order[] => orders;

  const newOrdersCount = orders.filter((o) => o.isNew || o.status === 'confirmed').length;

  return (
    <OrderContext.Provider value={{ 
      orders, 
      createOrder, 
      cancelOrder, 
      updateOrderStatus, 
      markOrderAsSeen,
      getOrdersByEmail, 
      getAllOrders,
      newOrdersCount 
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
