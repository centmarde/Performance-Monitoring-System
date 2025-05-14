import axios from 'axios';
import { supabase } from '@/lib/supabase';

interface TopicItem {
  subject: string;
  topics: string[];
}

interface SupabaseTopic {
  id: number;
  title: string;
  subject_id: number;
  created_at?: string;
}

/**
 * Fetch topics from Supabase for a specific subject
 * @param subjectId The ID of the subject to get topics for
 * @param classRecordId Optional class record ID to filter topics by
 * @returns Array of topic names or empty array if no topics found
 */
export const fetchTopicsFromSupabase = async (subjectId: number, classRecordId?: number | null): Promise<string[]> => {
  try {
    // Get topics specific to class record if provided, otherwise get general topics
    const { data, error } = await supabase
      .from('topics')
      .select('title')
      .eq('subject_id', subjectId)
      .eq('class_record_id', classRecordId || null);

    if (error) {
      console.error('Error fetching topics from Supabase:', error);
      return [];
    }

    // Extract topic titles from the returned data
    return data.map((topic: { title: string }) => topic.title);
  } catch (error) {
    console.error('Exception when fetching topics from Supabase:', error);
    return [];
  }
};

/**
 * Get topic IDs by class record ID and subject ID
 * @param subjectId The ID of the subject
 * @param classRecordId The ID of the class record
 * @returns Array of topic objects with id and title
 */
export const getTopicIdsByClassRecord = async (subjectId: number, classRecordId: number): Promise<Array<{id: number, title: string}>> => {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('id, title')
      .eq('subject_id', subjectId)
      .eq('class_record_id', classRecordId);

    if (error) {
      console.error('Error fetching topic IDs by class record:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Exception when fetching topic IDs by class record:', error);
    return [];
  }
};

/**
 * Fetch topics from the topics.json file (fallback method)
 * @returns Promise containing the array of topic items
 */
export const fetchTopicsFromJson = async (): Promise<TopicItem[]> => {
  try {
    const response = await axios.get('/data/topics.json');
    // Ensure the response data is an array before returning
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && typeof response.data === 'object') {
      // If it's an object but not an array, try to convert it to an array
      // This helps if the JSON is formatted differently than expected
      return [response.data];
    }
    console.warn('Unexpected topics.json format, returning empty array');
    return [];
  } catch (error) {
    console.error('Error fetching topics from JSON file:', error);
    return [];
  }
};

/**
 * Get topics for a specific subject by ID first, then by name if ID fails
 * @param subjectName The name of the subject to get topics for (fallback)
 * @param subjectId The ID of the subject to get topics for (primary)
 * @param classRecordId Optional class record ID to filter topics by
 * @returns Array of topic names or empty array if subject not found
 */
export const getTopicsForSubject = async (
  subjectName: string, 
  subjectId?: number | null,
  classRecordId?: number | null
): Promise<string[]> => {
  try {
    // First attempt: Try to get topics by subject_id from Supabase if ID is provided
    if (subjectId !== undefined && subjectId !== null) {
      const topicsFromSupabase = await fetchTopicsFromSupabase(subjectId, classRecordId);
      if (topicsFromSupabase.length > 0) {
        console.log(`Found ${topicsFromSupabase.length} topics for subject ID ${subjectId} in Supabase`);
        return topicsFromSupabase;
      }
    }

    // Second attempt (fallback): Try to get topics by subject name from JSON file
    console.log('Falling back to JSON file for topics');
    const topicsFromJson = await fetchTopicsFromJson();
    
    // Make sure topicsFromJson is an array before using find
    if (!Array.isArray(topicsFromJson)) {
      console.error('Expected topicsFromJson to be an array but got:', typeof topicsFromJson);
      return [];
    }
    
    const subjectData = topicsFromJson.find(item => 
      item && item.subject && typeof item.subject === 'string' &&
      item.subject.toLowerCase() === subjectName.toLowerCase()
    );
    
    // Ensure topics is an array before returning
    if (subjectData && Array.isArray(subjectData.topics)) {
      return subjectData.topics;
    } else {
      console.warn(`No topics found for subject "${subjectName}" in the JSON file`);
      return [];
    }
  } catch (error) {
    console.error('Error getting topics for subject:', error);
    return [];
  }
};
