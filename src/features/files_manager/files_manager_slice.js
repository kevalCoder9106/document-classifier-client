import { createSlice } from '@reduxjs/toolkit'
import { current } from '@reduxjs/toolkit'

import JSZip from 'jszip'

// zip file object
const zip = new JSZip()
// all classes
const class_list = ['Art & Science','Finance','Goverment & Politics','Health','Science & Technology']
// zip folder related to classes
const classes = [ zip.folder("Art & Science"), zip.folder("Finance"), zip.folder("Goverment & Politics"), zip.folder("Health"), zip.folder("Science & Technology") ]

const initialState = {
    classified: false,
    files: [],
    files_classes: [],
    files_classes_txt: [],
    status: 'Please Wait'
}

export const filesManagerSlice = createSlice({
    name: 'filesManagerSlice',
    initialState: initialState,
    reducers: {
        updateStatus: (state, action) => {
            state.status = action.payload
        },
        addFiles: (state, action) => {
            state.files = [...state.files, ...action.payload]
        },
        updateClasses: (state, action) => {
            state.classified = true
            state.files_classes = [...action.payload]
        },
        saveFiles: (state, action) => {
            const files = current(state.files)
            if (state.classified === true){
                let index = 0
                files.map(d => { 
                    classes[parseInt(state.files_classes[index])].file(d.path, d); 
                    index += 1
                })
                
                // removing folders that havent got in use
                const unique_set = [... new Set(state.files_classes)]
                if(!unique_set.includes('0'))
                    zip.remove(class_list[0])
                if(!unique_set.includes('1'))
                    zip.remove(class_list[1])
                if(!unique_set.includes('2'))
                    zip.remove(class_list[2])
                if(!unique_set.includes('3'))
                    zip.remove(class_list[3])
                if(!unique_set.includes('4'))
                    zip.remove(class_list[4])

                // downloading zip file
                zip.generateAsync({type: 'blob'})
                .then(async content => {
                    const fileURL = window.URL.createObjectURL(content);
                    let alink = document.createElement('a');
                    alink.href = fileURL;
                    alink.download = 'Classified Files.zip';
                    alink.click();
                })
            }
        }
    }
})

export const { updateStatus, addFiles, saveFiles, updateClasses } = filesManagerSlice.actions
export default filesManagerSlice.reducer