import { supabase } from '@/lib/supabase';

/**
 * Update a topic title in Supabase
 * @param topicId The ID of the topic to update
 * @param newTitle The new title for the topic
 * @returns Boolean indicating success or failure
 */
export const updateTopicTitle = async (topicId: number, newTitle: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('topics')
      .update({ title: newTitle })
      .eq('id', topicId);

    if (error) {
      console.error('Error updating topic title:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception when updating topic title:', error);
    return false;
  }
};

/**
 * Get all topics for a subject with complete information including IDs
 * @param subjectId The ID of the subject to get topics for
 * @returns Array of topics with id, title, and subject_id
 */
export const getTopicsWithIds = async (subjectId: number) => {
  try {
    const { data, error } = await supabase
      .from('topics')
      .select('id, title, subject_id')
      .eq('subject_id', subjectId);

    if (error) {
      console.error('Error fetching topics with IDs:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Exception when fetching topics with IDs:', error);
    return [];
  }
};

/**
 * Create a new topic for a subject
 * @param subjectId The ID of the subject to create a topic for
 * @param title The title of the new topic
 * @param classRecordId The ID of the class record to associate with this topic
 * @returns The created topic or null if creation failed
 */
export const createTopic = async (subjectId: number, title: string, classRecordId?: number | null) => {
  try {
    const topicData: any = { 
      title, 
      subject_id: subjectId 
    };
    
    // Only add class_record_id if it exists
    if (classRecordId) {
      topicData.class_record_id = classRecordId;
    }
    
    const { data, error } = await supabase
      .from('topics')
      .insert([topicData])
      .select();

    if (error) {
      console.error('Error creating new topic:', error);
      return null;
    }

    return data[0];
  } catch (error) {
    console.error('Exception when creating new topic:', error);
    return null;
  }
};

/**
 * Delete a topic
 * @param topicId The ID of the topic to delete
 * @returns Boolean indicating success or failure
 */
export const deleteTopic = async (topicId: number): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', topicId);

    if (error) {
      console.error('Error deleting topic:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Exception when deleting topic:', error);
    return false;
  }
};
