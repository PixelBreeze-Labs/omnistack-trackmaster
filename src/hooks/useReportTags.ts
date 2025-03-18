// hooks/useReportTags.ts
import { useState, useCallback, useMemo } from 'react';
import { createReportTagsApi } from '@/app/api/external/omnigateway/report-tags';
import { ReportTag, CreateReportTagDto, UpdateReportTagDto, ReportTagParams, ReportTagsResponse } from "@/app/api/external/omnigateway/types/report-tags";
import { useGatewayClientApiKey } from './useGatewayClientApiKey';
import toast from 'react-hot-toast';

export const useReportTags = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [reportTags, setReportTags] = useState<ReportTag[]>([]);
    const [totalItems, setTotalItems] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    const { apiKey } = useGatewayClientApiKey();
    const api = useMemo(() => apiKey ? createReportTagsApi(apiKey) : null, [apiKey]);

    const fetchReportTags = useCallback(async (params: ReportTagParams = {}) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.getReportTags(params);
            setReportTags(response.data);
            setTotalItems(response.meta.total);
            setCurrentPage(response.meta.page);
            setHasMore(response.meta.hasMore);
            return response;
        } catch (error) {
            console.error('Error fetching report tags:', error);
            toast.error('Failed to fetch report tags');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const createReportTag = useCallback(async (data: CreateReportTagDto) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.createReportTag(data);
            toast.success('Report tag created successfully');
            return response;
        } catch (error) {
            console.error('Error creating report tag:', error);
            toast.error('Failed to create report tag');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const updateReportTag = useCallback(async (id: string, data: Partial<UpdateReportTagDto>) => {
        if (!api) return;
        try {
            setIsLoading(true);
            const response = await api.updateReportTag(id, data);
            toast.success('Report tag updated successfully');
            return response;
        } catch (error) {
            console.error('Error updating report tag:', error);
            toast.error('Failed to update report tag');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    const deleteReportTag = useCallback(async (id: string) => {
        if (!api) return;
        try {
            setIsLoading(true);
            await api.deleteReportTag(id);
            toast.success('Report tag deleted successfully');
        } catch (error) {
            console.error('Error deleting report tag:', error);
            toast.error('Failed to delete report tag');
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, [api]);

    return {
        isLoading,
        reportTags,
        totalItems,
        currentPage,
        hasMore,
        fetchReportTags,
        createReportTag,
        updateReportTag,
        deleteReportTag,
        isInitialized: !!api
    };
};