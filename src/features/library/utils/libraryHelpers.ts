// /**
//  * Library utility functions for calculations and data transformations
//  */

// type Highlight = {
//   id: string;
//   text: string;
//   color: string;
//   createdAt: Date;
// };

// type Note = {
//   id: string;
//   content: string;
//   section: string;
//   createdAt: Date;
// };

// type TOCChapter = {
//   id: string;
//   title: string;
//   isBookmarked: boolean;
// };

// /**
//  * Generate a unique ID with timestamp
//  */
// export const generateUniqueId = (prefix: string): string => {
//   return `${prefix}-${Date.now()}`;
// };

// /**
//  * Create a new highlight object
//  */
// export const createHighlight = (
//   text: string,
//   color: string = "#fef3c7",
// ): Highlight => {
//   return {
//     id: generateUniqueId("highlight"),
//     text: text.trim(),
//     color,
//     createdAt: new Date(),
//   };
// };

// /**
//  * Create a new note object
//  */
// export const createNote = (content: string, section: string): Note => {
//   return {
//     id: generateUniqueId("note"),
//     content: content.trim(),
//     section,
//     createdAt: new Date(),
//   };
// };

// /**
//  * Toggle bookmark status for a chapter
//  */
// export const toggleChapterBookmark = (
//   chapters: TOCChapter[],
//   chapterId: string,
// ): TOCChapter[] => {
//   return chapters.map((chapter) =>
//     chapter.id === chapterId
//       ? { ...chapter, isBookmarked: !chapter.isBookmarked }
//       : chapter,
//   );
// };

// /**
//  * Validate note input
//  */
// export const isValidNote = (content: string, section: string): boolean => {
//   return content.trim().length > 0 && section.trim().length > 0;
// };

// /**
//  * Validate highlight input
//  */
// export const isValidHighlight = (text: string): boolean => {
//   return text.trim().length > 0;
// };

// /**
//  * Format date for display
//  */
// export const formatDate = (date: Date): string => {
//   return date.toLocaleString();
// };

// /**
//  * Get current timestamp
//  */
// export const getCurrentTimestamp = (): number => {
//   return Date.now();
// };
