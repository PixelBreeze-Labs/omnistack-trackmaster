// app/api/external/omnigateway/members.ts
import { createOmniGateway } from './index';
import { CreateMemberDto, UpdateMemberDto, Member } from './types/members';

export const createMembersApi = (apiKey: string) => {
    const api = createOmniGateway(apiKey);

    return {
        getMembers: async (params = {}) => {
            const { data } = await api.get('/members', { params });
            return data;
        },
        createMember: async (memberData: CreateMemberDto) => {
            const { data } = await api.post('/members', memberData);
            return data;
        },
        updateMember: async (id: string, memberData: Partial<UpdateMemberDto>) => {
            const { data } = await api.put(`/members/${id}`, memberData);
            return data;
        },
        getMember: async (id: string) => {
            const { data } = await api.get(`/members/${id}`);
            return data;
        },
        deleteMember: async (id: string) => {
            const { data } = await api.delete(`/members/${id}`);
            return data;
        }
    };
};