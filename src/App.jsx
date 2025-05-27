import { useEffect, useState } from 'react'

function App() {
  const [isAddFormVisible, setIsAddFormVisible] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [inputDecription, setInputDescription] = useState('')
  const [editstate, setEditState] = useState(false)
  const [todo, setTodo] = useState([])

  useEffect(() => {  
    // Load initial todo from memory (localStorage not supported in this environment)
    // In a real environment, this would load from localStorage
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      try {
        const parsedTodos = JSON.parse(storedTodos);
        if (Array.isArray(parsedTodos)) {
          setTodo(parsedTodos);
        } else {
          console.warn("Stored todos is not an array, resetting.");
          setTodo([]);
        }
      } catch (error) {
        console.error("Failed to parse todos from localStorage:", error);
        setTodo([]);
      }
    }
  },[]);

  function handleInputChange(event) {
    const { name, value } = event.target;
    if (name === 'title') {
      setInputValue(value);
    } else if (name === 'description') {
      setInputDescription(value);
    }
  }

  function handleAddTodo() {
    if (inputValue.trim() === '') return;
    if (editstate) {
      const updatedTodos = todo.map(item => 
        item.text === inputValue ? { ...item, description: inputDecription } : item
      );
      setTodo(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setInputValue('');
      setInputDescription('');
      setEditState(false);
      return;
    }else{
      const newTodo = {
      id: Date.now(),
      text: inputValue,
      description: inputDecription,
      completed: false
      };
      const updatedTodos = [...todo, newTodo];
      setTodo(updatedTodos);
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
      setInputValue('');
      setInputDescription('');
    }
  }

  function toggleAddFormVisibility() {
    setIsAddFormVisible(!isAddFormVisible)
  }

  function handleDeleteTodo(id) {
    const updatedTodos = todo.filter(item => item.id !== id);
    setTodo(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  function handlecompleteTodo(id) {
    const updatedTodos = todo.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTodo(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  }

  function handleEditTodo(id) {
    const todoToEdit = todo.find(item => item.id === id);
    setEditState(true);
    //console.log(todoToEdit);
    if (todoToEdit) {
      setInputValue(todoToEdit.text);
      setInputDescription(todoToEdit.description);
      setIsAddFormVisible(true);
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">✓ Todo App</h1>
          <p className="text-gray-600">จัดการงานของคุณอย่างมีประสิทธิภาพ</p>
        </div>

        {/* localStorage Limitation Notice */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6 ">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                <strong>ข้อจำกัด:</strong> ข้อมูลถูกเก็บใน localStorage ไม่สามารถใช้งานได้ในเครื่องอื่น จำกัดแค่ ~5MB
              </p>
            </div>
          </div>
        </div>

        {/* Add Task Form */}
        <div className="bg-white rounded-md shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">เพิ่มงานใหม่</h2>
            <button 
              onClick={toggleAddFormVisibility}
              className={`px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                isAddFormVisible 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-indigo-500 hover:bg-indigo-600 text-white hover:shadow-md'
              }`}
            >
              {isAddFormVisible ? '✕ ยกเลิก' : '+ เพิ่มงาน'}
            </button>
          </div>

          {isAddFormVisible && (
            <div className="space-y-4 animate-in slide-in-from-top duration-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">ชื่องาน</label>
                <input
                  type="text"
                  name="title"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="ระบุชื่องานที่ต้องทำ..."
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">รายละเอียด</label>
                <input
                  type="text"
                  name="description"
                  value={inputDecription}
                  onChange={handleInputChange}
                  placeholder="เพิ่มรายละเอียดงาน... (ไม่จำเป็น)"
                  className="border border-gray-300 p-2 rounded-md w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
              
              <button 
                onClick={handleAddTodo} 
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors hover:shadow-md w-full"
              >
                 {editstate ? "แก้ไข" : "✓ เพิ่มงาน"}
              </button>
            </div>
          )}
        </div>

        {/* Todo List */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800">รายการงาน ({todo.length})</h2>
          </div>
          
          {todo.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">ยังไม่มีงานในรายการ</p>
              <p className="text-gray-400">เริ่มเพิ่มงานแรกของคุณสิ!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ">งาน</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายละเอียด</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todo.map((item) => (
                    <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${item.completed ? 'opacity-75' : ''}`}>
                      <td className="px-6 py-4">
                        <div className={`font-medium ${item.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.text}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`text-sm ${item.completed ? 'line-through text-gray-400' : 'text-gray-600'}`}>
                          {item.description || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          item.completed 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.completed ? "✓ เสร็จแล้ว" : "⏳ กำลังทำ"}
                        </span>
                      </td>
                      <td className="px-6 py-4 ">
                        <div className="flex space-x-2 ">
                          <button 
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              item.completed
                                ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white'
                            }`}
                            onClick={() => handlecompleteTodo(item.id)}
                          >
                            {item.completed ? "↺ ทำต่อ" : "✓ เสร็จ"}
                          </button>
                          <button 
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            onClick={() => handleDeleteTodo(item.id)}
                          >
                            🗑 ลบ
                          </button>
                          <button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors'
                            onClick={() => handleEditTodo(item.id)}
                            >
                            ✏ แก้ไข
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Create by JessadaID</p>
        </div>
      </div>
    </div>
  )
}

export default App