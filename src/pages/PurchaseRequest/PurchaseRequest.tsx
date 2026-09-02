import React from 'react';
import { useLocation } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewPurchaseRequest from './NewPurchaseRequest';
import PurchaseRequestList from './PurchaseRequestList';

const PurchaseRequest = () => {
  const location = useLocation();
  const defaultTab = location.state?.activeTab || "new";

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Purchase Request</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your purchase requests for cars or household items.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8 max-w-md">
          <TabsTrigger value="new">New Request</TabsTrigger>
          <TabsTrigger value="list">My Requests</TabsTrigger>
        </TabsList>
        <TabsContent value="new">
          <NewPurchaseRequest />
        </TabsContent>
        <TabsContent value="list">
          <PurchaseRequestList />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseRequest;
