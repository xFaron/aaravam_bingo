import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Import Supabase client

function TaskModal({ task, userName, onClose }) {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchExistingData = async () => {
      const { data } = await supabase
        .from('submissions')
        .select('text_input')
        .eq('user_name', userName)
        .eq('task_id', task.id)
        .single();
      
      if (data) {
        setText(data.text_input || '');
      }
    };
    fetchExistingData();
  }, [task.id, userName]);

  // Helper function to upload a file and get its public URL
  const uploadFile = async (file) => {
    if (!file) return null;

    // Create a more predictable and clean file path
    const fileExt = file.name.split('.').pop();
    const filePath = `${userName}/${task.id}.${fileExt}`;

    // Upload file, allowing for overwriting if the user uploads a file with the same name
    const { error: uploadError } = await supabase.storage
      .from('bingo-files')
      .upload(filePath, file, { upsert: true }); // Using upsert: true simplifies overwriting

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('bingo-files')
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if ((task.textInput && task.id != 8) && task.answer.toLowerCase() !== text.toLowerCase() ) {
      alert('Wrong Answer :)');
      setIsSubmitting(false);
      return;
    }
    
    try {

      const { data: existingSubmission, error: fetchError } = await supabase
        .from('submissions')
        .select('image_url')
        .eq('user_name', userName)
        .eq('task_id', task.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') { // Ignore 'no rows' error
        throw fetchError;
      }

      const getPathFromUrl = (url) => {
        if (!url) return null;
        return url.split('/bingo-files/')[1];
      };

      const filesToDelete = [];
      console.log("Existing Submission")
      console.log(existingSubmission)
      if ( image && existingSubmission?.image_url ) {
        filesToDelete.push(getPathFromUrl(existingSubmission.image_url))
      }

      const validFilesToDelete = filesToDelete.filter(path => path);
      console.log("ValidFilesToDelete");
      console.log(validFilesToDelete);
      if (validFilesToDelete.length > 0) {
        const { error: removeError } = await supabase.storage
          .from('bingo-files')
          .remove(validFilesToDelete);

        if (removeError) {
          console.error("Could not delete old files:", removeError);
        }
      }

      const imageUrl = await uploadFile(image);
      
      const submissionData = {
        user_name: userName,
        task_id: task.id,
        text_input: text,
        image_url: imageUrl,
      };

      // Use 'upsert' to insert a new row or update it if it already exists
      // based on the unique constraint (user_name, task_id)
      const { error } = await supabase
        .from('submissions')
        .upsert(submissionData,
          {
            onConflict: ['user_name', 'task_id']
          }
        );

      if (error) throw error;
      
      alert('Submission saved!');
      onClose(true); // Close modal and indicate completion
    } catch (error) {
      console.error("Error saving submission: ", error);
      alert(`Failed to save submission: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  // The JSX part of the component (the form) remains exactly the same
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{task.title}</h2>
        <p>{task.description}</p>
        <p>{task.disclaimer}</p>
        {/* ... the rest of your form JSX is unchanged ... */}
        <form onSubmit={handleSubmit}>

          {
            task.textInput && (
              <>
                <label>Answer:</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)} 
                />
              </>
            )
          }

          {
            task.uploadImage && (
              <>
                <label>Upload Image:</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setImage(e.target.files[0])} 
                />
              </>
            )
          }

          <div className="modal-actions">
            <button className="btn btn-secondary" type="button" onClick={() => onClose(false)} disabled={isSubmitting}>Cancel</button>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save & Complete'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;