import { useCallback } from 'react';

type StoreWithRefresh = {
    isError: boolean;
    refresh: () => Promise<void>;
};

export function createRefreshFunction (stores: StoreWithRefresh[]) {
  return useCallback(() => {
    stores.forEach((store) => {
      if (store.isError) {
        store.refresh().then();
      }
    });
  }, stores.map((s) => s.isError)); // зависимости по isError
}
