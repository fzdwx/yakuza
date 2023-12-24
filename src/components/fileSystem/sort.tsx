import {File} from "@/components/fileSystem/types";

const sort = (files: File[]) => {
    return files.sort((a, b) => {
        if (a.isDir && b.isDir) {
            if (a.name.startsWith(".") && !b.name.startsWith(".")) {
                return 1
            } else if (!a.name.startsWith(".") && b.name.startsWith(".")) {
                return -1
            }
        }
        if (a.isDir && !b.isDir) {
            return -1
        } else if (!a.isDir && b.isDir) {
            return 1
        } else {
            return 0
        }
    });
}

export {sort}
