import {
    useQuery,
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import { projectsAPI } from '../../service/inventoryApi/projectApi';
import type { ProjectReqDTO } from '../../types/requestDto';

const PROJECTS = 'Projects' as const;

/** e.g. queryKeys.list() ➜ ['Projects','list'] */
const queryKeys = {
    base: [PROJECTS] as const,
    list: () => [...queryKeys.base, 'list'] as const,
    paged: (p: number, s: number) =>
        [...queryKeys.base, 'paged', p, s] as const,
    search: (n: string, p: number, s: number) =>
        [...queryKeys.base, 'search', n, p, s] as const,
    sorted: () => [...queryKeys.base, 'sorted'] as const,
    detail: (id: number) => [...queryKeys.base, id] as const
};

export const useProjects = () =>
    useQuery({
        queryKey: queryKeys.list(),
        queryFn: projectsAPI.getAll
    });

export const useProject = (id: number) =>
    useQuery({
        queryKey: queryKeys.detail(id),
        queryFn: () => projectsAPI.getById(id),
        enabled: !!id
    });

export const useSortedProjects = () =>
    useQuery({ queryKey: queryKeys.sorted(), queryFn: projectsAPI.getSorted });

export const usePagedProjects = (page: number, size: number) =>
    useQuery({
        queryKey: queryKeys.paged(page, size),
        queryFn: () => projectsAPI.getPaged(page, size),
        // keepPreviousData
    });

export const useSearchProjects = (
    name: string,
    pageNumber: number,
    pageSize: number
) =>
    useQuery({
        queryKey: queryKeys.search(name, pageNumber, pageSize),
        queryFn: () => projectsAPI.search(name, pageSize, pageNumber),
        enabled: !!name,
        // keepPreviousData
    });

export const useProjectCount = () =>
    useQuery({ queryKey: [...queryKeys.base, 'count'],
        queryFn: projectsAPI.countByUser
    });

export const useProjectIds = () =>
    useQuery({ queryKey: [...queryKeys.base, 'ids'], queryFn: projectsAPI.getProjectIdsByUser });


// WRITE HOOKS  (all auto‑invalidate the project lists & details)
const invalidateLists = (qc: ReturnType<typeof useQueryClient>) =>
    qc.invalidateQueries({ queryKey: queryKeys.base });

export const useCreateProject = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (dto: ProjectReqDTO) => projectsAPI.create(dto),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useCreateProjectsBatch = (batchSize: number) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (list: ProjectReqDTO[]) =>
            projectsAPI.createBatch(list, batchSize),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useUpdateProject = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, dto }: { id: number; dto: ProjectReqDTO }) =>
            projectsAPI.update(id, dto),
        onSuccess: (_, { id }) => {
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) });
            invalidateLists(qc);
        }
    });
};

export const useDeleteProject = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (id: number) => projectsAPI.delete(id),
        onSuccess: () => invalidateLists(qc)
    });
};

export const useDeleteProjectsBatch = () => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: (ids: number[]) => projectsAPI.deleteBatch(ids),
        onSuccess: () => invalidateLists(qc)
    });
};

// ---------- PATCH helpers: locations & users ---------------------------------
const usePatchHelper = <
    K extends 'add' | 'remove',
    FN extends (...args: any[]) => Promise<any>
>(
    action: K,
    apiFn: FN
) => {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({ id, ids }: { id: number; ids: Set<number> }) =>
            apiFn(id, ids),
        onSuccess: (_, { id }) =>
            qc.invalidateQueries({ queryKey: queryKeys.detail(id) })
    });
};

export const useAddLocations = () =>
    usePatchHelper('add', projectsAPI.addLocations);
export const useRemoveLocations = () =>
    usePatchHelper('remove', projectsAPI.removeLocations);
export const useAddUsers = () =>
    usePatchHelper('add', projectsAPI.addUsers);
export const useRemoveUsers = () =>
    usePatchHelper('remove', projectsAPI.removeUsers);

// -----------------------------------------------------------------------------
// ACCESS‑CHECK helper (simple query, no cache invalidation needed)
// -----------------------------------------------------------------------------
export const useProjectAccess = (id: number) =>
    useQuery({
        queryKey: [...queryKeys.detail(id), 'access'],
        queryFn: () => projectsAPI.isAccessible(id),
        enabled: !!id
    });
