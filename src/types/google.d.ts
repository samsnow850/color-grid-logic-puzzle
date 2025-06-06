
interface Window {
  google?: {
    accounts?: {
      id?: {
        initialize: (options: {
          client_id: string;
          callback: (response: { credential: string }) => void;
        }) => void;
        renderButton: (
          element: HTMLElement, 
          options: {
            theme?: string;
            size?: string;
            text?: string;
            width?: number;
            type?: string;
            shape?: string;
            logo_alignment?: string;
          }
        ) => void;
      };
    };
  };
}
