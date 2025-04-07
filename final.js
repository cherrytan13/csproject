document.addEventListener("DOMContentLoaded", () => {
    // Initialize Supabase client FIRST
    const supabase = window.supabase.createClient(
      "https://gyywkzwxfuizlhbglady.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5eXdrend4ZnVpemxoYmdsYWR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM5NTc2MjgsImV4cCI6MjA1OTUzMzYyOH0.rYuRP2ExtQ93IW1kL0gS0-XasMnNFaUxoBKo_V46rU4"
    );
  
    // Then use it in your form handler
    document.getElementById("taskForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      
      try {
        const formData = {
          task1: document.getElementById("task1").value,
          date1: document.getElementById("date1").value,
          
          task2: document.getElementById("task2").value,
          date2: document.getElementById("date2").value,
          task3: document.getElementById("task3").value,
          date3: document.getElementById("date3").value,
          
        };
  
        // Validate required fields
        
  
        const { data, error } = await supabase
          .from('tasks')
          .insert([formData])
          .select();
  
        if (error) throw error;
        if (!data?.length) throw new Error("No data returned");
  
        alert(`Congrajulations your task is saved! ID: ${data[0].id}`);
        console.log("Inserted data:", data[0]);
        
      } catch (error) {
        console.error("Error:", error);
        alert(`Error: ${error.message}`);
      }
    });
  });