import axios from 'axios';

interface TopicItem {
  subject: string;
  topics: string[];
}

/**
 * Fetch topics from the topics.json file
 * @returns Promise containing the array of topic items
 */
export const fetchTopics = async (): Promise<TopicItem[]> => {
  try {
    const response = await axios.get('/data/topics.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching topics:', error);
    return [];
  }
};

/**
 * Get topics for a specific subject
 * @param subjectName The name of the subject to get topics for
 * @returns Array of topic names or empty array if subject not found
 */
export const getTopicsForSubject = async (subjectName: string): Promise<string[]> => {
  try {
    const topics = await fetchTopics();
    const subjectData = topics.find(item => 
      item.subject.toLowerCase() === subjectName.toLowerCase()
    );
    
    return subjectData?.topics || [];
  } catch (error) {
    console.error('Error getting topics for subject:', error);
    return [];
  }
};
