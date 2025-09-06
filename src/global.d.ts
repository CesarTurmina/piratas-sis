export {};

declare global {
  interface Window {
    api: {
      addEmployee: (name: string, role: string) => Promise<any>;
      listEmployees: (activeOnly?: boolean) => Promise<any[]>;

      addCharge: (p: {
        employeeId: number;
        item: string;
        amountCents: number;
        whenISO: string;
      }) => Promise<any>;
      listCharges: (p: {
        employeeId?: number;
        monthISO?: string; // (renderer usa "monthISO"); na store é "ym", mas ok
        startDate?: string;
        endDate?: string;
      }) => Promise<any[]>;
      sumCharges: (p: {
        employeeId?: number;
        monthISO?: string;
        startDate?: string;
        endDate?: string;
      }) => Promise<number>;

      addDelivery: (p: {
        employeeId: number;
        count: number;
        tipsCents: number;
        discountCents: number;
        whenISO: string;
        }) => Promise<any>;
      listDeliveries: (p: {
        employeeId?: number;
        ym?: string;
        startDate?: string;
        endDate?: string;
      }) => Promise<any[]>;
      printReport: (html: string) => Promise<void>;
    };
  }
}