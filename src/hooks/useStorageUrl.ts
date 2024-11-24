import { useQuery } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

export function useStorageUrl(storageId: Id<"_storage">) {
  return useQuery(api.storage.getUrl, storageId ? { storageId } : "skip");
}
